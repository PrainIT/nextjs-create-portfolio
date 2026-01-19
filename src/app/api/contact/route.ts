import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// 요청 본문 타입 정의
interface ContactFormData {
  name: string;
  projectInfo?: string;
  message?: string;
}

// 환경 변수 검증
function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} 환경 변수가 설정되지 않았습니다.`);
  }
  return value;
}

// 이메일 전송 함수
async function sendEmail(data: ContactFormData) {
  const smtpHost = getEnvVar("SMTP_HOST");
  const smtpPort = parseInt(getEnvVar("SMTP_PORT"), 10);
  const smtpUser = getEnvVar("SMTP_USER");
  const smtpPass = getEnvVar("SMTP_PASS");
  const recipientEmail = getEnvVar("RECIPIENT_EMAIL");

  // SMTP 트랜스포터 생성
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false, // 587 포트는 TLS 사용
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  // 이메일 내용 구성
  const mailOptions = {
    from: `"포트폴리오 문의" <${smtpUser}>`,
    to: recipientEmail,
    subject: `[포트폴리오 문의] ${data.name}님의 문의`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
          새로운 포트폴리오 문의가 도착했습니다
        </h2>
        
        <div style="margin-top: 20px;">
          <h3 style="color: #555; margin-bottom: 10px;">문의자 정보</h3>
          <p style="color: #666; line-height: 1.6;">
            <strong>이름:</strong> ${data.name}
          </p>
        </div>

        ${data.projectInfo ? `
        <div style="margin-top: 20px;">
          <h3 style="color: #555; margin-bottom: 10px;">프로젝트 정보</h3>
          <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">
            ${data.projectInfo}
          </p>
        </div>
        ` : ""}

        ${data.message ? `
        <div style="margin-top: 20px;">
          <h3 style="color: #555; margin-bottom: 10px;">메시지</h3>
          <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">
            ${data.message}
          </p>
        </div>
        ` : ""}

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p>이 이메일은 포트폴리오 웹사이트의 문의 폼을 통해 전송되었습니다.</p>
        </div>
      </div>
    `,
    text: `
새로운 포트폴리오 문의가 도착했습니다

문의자 정보
이름: ${data.name}

${data.projectInfo ? `프로젝트 정보\n${data.projectInfo}\n` : ""}
${data.message ? `메시지\n${data.message}\n` : ""}
    `.trim(),
  };

  // 이메일 전송
  const info = await transporter.sendMail(mailOptions);
  return info;
}

export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const body: ContactFormData = await request.json();

    // 기본 검증
    if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
      return NextResponse.json(
        { error: "이름은 필수 항목입니다." },
        { status: 400 }
      );
    }

    // 이메일 전송
    const info = await sendEmail({
      name: body.name.trim(),
      projectInfo: body.projectInfo?.trim(),
      message: body.message?.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "문의가 성공적으로 전송되었습니다.",
        messageId: info.messageId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("이메일 전송 오류:", error);

    // 환경 변수 오류
    if (error instanceof Error && error.message.includes("환경 변수")) {
      return NextResponse.json(
        { error: "서버 설정 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    // 기타 오류
    return NextResponse.json(
      { error: "이메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
