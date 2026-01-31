import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export interface ContactFormData {
  companyOrName: string;
  contact: string;
  email: string;
  projectType: string;
  content: string;
  budget: string;
  startDate: string;
  endDate: string;
}

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} 환경 변수가 설정되지 않았습니다.`);
  }
  return value;
}

function validateFormData(
  raw: Record<string, string>,
): { ok: true; data: ContactFormData } | { ok: false; error: string } {
  const companyOrName = (raw.companyOrName ?? "").trim();
  const contact = (raw.contact ?? "").trim();
  const email = (raw.email ?? "").trim();
  const projectType = (raw.projectType ?? "").trim();

  if (!companyOrName)
    return { ok: false, error: "회사명/담당자 성명을 입력해주세요." };
  if (!contact) return { ok: false, error: "연락처를 입력해주세요." };
  if (!email) return { ok: false, error: "이메일을 입력해주세요." };
  if (!projectType)
    return { ok: false, error: "프로젝트 유형을 선택해주세요." };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return { ok: false, error: "올바른 이메일을 입력해주세요." };

  return {
    ok: true,
    data: {
      companyOrName,
      contact,
      email,
      projectType,
      content: (raw.content ?? "").trim(),
      budget: (raw.budget ?? "").trim(),
      startDate: (raw.startDate ?? "").trim(),
      endDate: (raw.endDate ?? "").trim(),
    },
  };
}

function buildEmailHtml(data: ContactFormData): string {
  const rows: [string, string][] = [
    ["회사명/담당자 성명", data.companyOrName],
    ["연락처", data.contact],
    ["이메일", data.email],
    ["프로젝트 유형", data.projectType],
  ];
  if (data.content) rows.push(["내용", data.content]);
  if (data.budget) rows.push(["예산", data.budget]);
  if (data.startDate) rows.push(["프로젝트 시작 예상일", data.startDate]);
  if (data.endDate) rows.push(["프로젝트 종료 예상일", data.endDate]);

  const rowsHtml = rows
    .map(
      ([label, value]) => `
    <tr>
      <td style="padding: 10px 16px 10px 0; color: #555; font-weight: 600; vertical-align: top; width: 180px;">${label}</td>
      <td style="padding: 10px 0; color: #333; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(String(value))}</td>
    </tr>`,
    )
    .join("");

  return `
    <div style="font-family: 'Malgun Gothic', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 2px solid #e85d04; padding-bottom: 10px;">
        [프로젝트 리퀘스트] 문의가 도착했습니다
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
        ${rowsHtml}
      </table>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
        <p>이 이메일은 포트폴리오 웹사이트 문의 폼을 통해 전송되었습니다.</p>
      </div>
    </div>
  `.trim();
}

function buildEmailText(data: ContactFormData): string {
  const lines: string[] = [
    "[프로젝트 리퀘스트] 문의가 도착했습니다",
    "",
    "회사명/담당자 성명: " + data.companyOrName,
    "연락처: " + data.contact,
    "이메일: " + data.email,
    "프로젝트 유형: " + data.projectType,
  ];
  if (data.content) lines.push("", "내용:", data.content);
  if (data.budget) lines.push("", "예산: " + data.budget);
  if (data.startDate) lines.push("", "프로젝트 시작 예상일: " + data.startDate);
  if (data.endDate) lines.push("", "프로젝트 종료 예상일: " + data.endDate);
  lines.push(
    "",
    "---",
    "이 이메일은 포트폴리오 웹사이트 문의 폼을 통해 전송되었습니다.",
  );
  return lines.join("\n");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendEmail(
  data: ContactFormData,
  attachment?: { filename: string; content: Buffer },
) {
  const smtpHost = getEnvVar("SMTP_HOST");
  const smtpPort = parseInt(getEnvVar("SMTP_PORT"), 10);
  const smtpUser = getEnvVar("SMTP_USER");
  const smtpPass = getEnvVar("SMTP_PASS");
  const recipientEmail = getEnvVar("RECIPIENT_EMAIL");

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  const mailOptions: nodemailer.SendMailOptions = {
    from: `"포트폴리오 문의" <${smtpUser}>`,
    to: recipientEmail,
    subject: `[프로젝트 리퀘스트] ${data.companyOrName} - ${data.projectType}`,
    html: buildEmailHtml(data),
    text: buildEmailText(data),
  };

  if (attachment) {
    mailOptions.attachments = [
      {
        filename: attachment.filename,
        content: attachment.content,
      },
    ];
  }

  const info = await transporter.sendMail(mailOptions);
  return info;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const raw = {
      companyOrName: formData.get("companyOrName")?.toString() ?? "",
      contact: formData.get("contact")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      projectType: formData.get("projectType")?.toString() ?? "",
      content: formData.get("content")?.toString() ?? "",
      budget: formData.get("budget")?.toString() ?? "",
      startDate: formData.get("startDate")?.toString() ?? "",
      endDate: formData.get("endDate")?.toString() ?? "",
    };

    const validated = validateFormData(raw);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const data = validated.data;

    let attachment: { filename: string; content: Buffer } | undefined;
    const file = formData.get("reference");
    if (file instanceof File && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      attachment = {
        filename: file.name || "reference",
        content: buffer,
      };
    }

    const info = await sendEmail(data, attachment);

    return NextResponse.json(
      {
        success: true,
        message: "문의가 성공적으로 전송되었습니다.",
        messageId: info.messageId ?? "",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("이메일 전송 오류:", error);

    if (error instanceof Error && error.message.includes("환경 변수")) {
      return NextResponse.json(
        { error: "서버 설정 오류가 발생했습니다." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        error: "이메일 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      },
      { status: 500 },
    );
  }
}
