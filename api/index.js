export default function handler(request, response) {
  response.status(200).json({
    message: "welcome to the serverless test api",
    timestamp: new Date().toISOString(),
  });
}
