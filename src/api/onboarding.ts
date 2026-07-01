export interface OnboardingStatusResponse {
  email: string;
  name: string;
  nickname: string;
  picture: string;
  onboardingStep: string;
  currentResidence: string;
  schoolName: string;
  major: string;
  targetPeriod: string;
}

export async function getOnboardingStatus(): Promise<OnboardingStatusResponse> {
  const res = await fetch("/api/onboarding/status", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) throw new Error("온보딩 상태 조회 실패");

  return res.json();
}

export async function resetOnboarding(): Promise<string> {
  const res = await fetch("/api/onboarding/reset", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("온보딩 초기화 실패");

  return res.text();
}

export async function updateOnboarding(data: any) {
  const res = await fetch("/api/onboarding", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("온보딩 실패");

  return res.json();
}
