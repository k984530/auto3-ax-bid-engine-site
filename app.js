const segment = document.querySelector("#segment");
const projectSize = document.querySelector("#projectSize");
const urgency = document.querySelector("#urgency");
const owner = document.querySelector("#owner");
const proofInputs = Array.from(document.querySelectorAll('input[name="proof"]'));
const scoreNode = document.querySelector("#score");
const recommendationNode = document.querySelector("#recommendation");
const requestLinkNode = document.querySelector("#requestLink");
const paidScanLinkNode = document.querySelector("#paidScanLink");
const requestBaseUrl =
  "https://github.com/k984530/auto3-ax-bid-engine-site/issues/new";
const liveUrl = "https://won-space.com/auto3-ax-bid-engine-site/";
const paidScanRequestUrl = "./paid-scan-request.html";

const segmentWeights = {
  vendor: 18,
  manufacturer: 15,
  integrator: 17,
  consultant: 13,
};

const sizeWeights = {
  small: 8,
  mid: 16,
  large: 20,
  enterprise: 18,
};

const proofWeights = {
  idea: 6,
  demo: 15,
  case: 24,
};

const segmentLabels = {
  vendor: "AI 벤더",
  manufacturer: "제조 SME",
  integrator: "IT integrator",
  consultant: "컨설턴트",
};

function currentProof() {
  const selected = proofInputs.find((input) => input.checked);
  return selected ? selected.value : "demo";
}

function clampScore(value) {
  return Math.max(30, Math.min(96, value));
}

function buildRecommendation(score) {
  if (score >= 82) {
    return "Proposal Sprint로 바로 전환할 수 있는 강한 후보입니다.";
  }

  if (score >= 68) {
    return "유료 Opportunity Scan으로 시작하기 좋습니다.";
  }

  if (score >= 54) {
    return "증빙과 목표 고객을 좁힌 뒤 Scan을 진행하는 편이 좋습니다.";
  }

  return "먼저 use case와 내부 책임자를 정리해야 합니다.";
}

function buildRequestIssueUrl({ segmentName, score, recommendation }) {
  const title = `[AX Bid Engine] ${segmentName} scan request`;
  const body = [
    "## AX Opportunity Scan request",
    "",
    `- Customer segment: ${segmentName}`,
    `- Fit score: ${score}`,
    `- Recommendation: ${recommendation}`,
    `- Source page: ${liveUrl}`,
    "",
    "## Company / product",
    "",
    "- Company:",
    "- Product or project:",
    "- Target customer or industry:",
    "",
    "## Timing",
    "",
    "- Desired review date:",
    "- Known deadline or program:",
    "",
    "## Available evidence",
    "",
    "- Demo / customer proof / data readiness:",
    "- Internal owner:",
    "",
    "## Guardrail",
    "",
    "Please do not include private personal data, candidate data, confidential customer data, or trade secrets in this public issue.",
  ].join("\n");
  const params = new URLSearchParams({
    template: "scan-request.md",
    title,
    body,
  });

  return `${requestBaseUrl}?${params.toString()}`;
}

function buildPaidScanRequestPageUrl({ segmentName, score, recommendation }) {
  const params = new URLSearchParams({
    segment: segmentName,
    score: String(score),
    recommendation,
  });

  return `${paidScanRequestUrl}?${params.toString()}`;
}

function updateScan() {
  const proof = currentProof();
  const urgencyScore = Number.parseInt(urgency.value, 10) * 5;
  const ownerScore = owner.checked ? 13 : 2;
  const baseScore =
    12 +
    segmentWeights[segment.value] +
    sizeWeights[projectSize.value] +
    proofWeights[proof] +
    urgencyScore +
    ownerScore;
  const score = clampScore(baseScore);
  const segmentName = segmentLabels[segment.value];
  const recommendation = buildRecommendation(score);

  scoreNode.textContent = String(score);
  recommendationNode.textContent = recommendation;
  requestLinkNode.href = buildRequestIssueUrl({ segmentName, score, recommendation });
  paidScanLinkNode.href = buildPaidScanRequestPageUrl({
    segmentName,
    score,
    recommendation,
  });
}

[segment, projectSize, urgency, owner, ...proofInputs].forEach((control) => {
  control.addEventListener("input", updateScan);
  control.addEventListener("change", updateScan);
});

updateScan();
