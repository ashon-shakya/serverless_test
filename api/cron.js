export default function handler(request, response) {
  console.log("welcome to api");
  response.status(200).json({
    message: "welcome to api",
    timestamp: new Date().toISOString(),
  });
}
