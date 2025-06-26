export const handler = async (event) => {
  const webhookId = "your-discord-webhook-id";
  const webhookToken = "your-discord-webhook-token";

  // 해당 토큰은 themoment-team 조직에 접근할 수 있고, owner 권한이 있는 사람의 토큰이어야함
  const githubToken = process.env.GITHUB_TOKEN;

  const owner = "themoment-team";
  const repo = "hellogsm-front-24";
  const workflowFileName = "regular-deploy.yml";
  const ref = "main";

  try {
    await fetch(
      `https://discord.com/api/webhooks/${webhookId}/${webhookToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: "📢 정기 배포 PR을 생성합니다!",
        }),
      }
    );
    console.log("디스코드 알림 전송 완료");

    const githubRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflowFileName}/dispatches`,
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${githubToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ref,
        }),
      }
    );

    if (githubRes.ok) {
      console.log("github action실행 성공");
    } else {
      const errorText = await githubRes.text();
      console.error("gitHub action 실행 실패:", errorText);
    }
  } catch (error) {
    console.error("error", error);
  }
};
