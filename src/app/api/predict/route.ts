import { NextResponse } from "next/server";
import { spawn } from "child_process";

export async function GET() {
  try {
    // Fetch the performance data from your API endpoint
    const performanceData = await fetch(
      "http://localhost:3000/api/performance"
    ).then((res) => res.json());

    console.log("Performance data:", performanceData);

    // Use Promise to await the Python process completion
    const predictions = await runPythonScript(performanceData);

    // Return the predictions as the response
    return NextResponse.json(predictions);
  } catch (error) {
    // Catch any errors in the fetching or spawning process
    console.error("Error in prediction process:", error);
    return NextResponse.json(
      { error: "An error occurred during prediction" },
      { status: 500 }
    );
  }
}

// Function to run the Python script and wait for the output
function runPythonScript(performanceData: any) {
  return new Promise((resolve, reject) => {
    const python = spawn("python3", ["ml/predict_performance.py"]);

    // Write the performance data to the Python script's stdin
    python.stdin.write(JSON.stringify(performanceData));
    python.stdin.end();

    let output = "";

    // Collect the output from the Python script
    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    // Handle the process close event
    python.on("close", (code) => {
      if (code !== 0) {
        // Reject the promise if the Python script fails
        console.error("Python script failed with code", code);
        reject(new Error("Prediction script failed"));
      }

      try {
        // Parse the predictions from the Python output
        const predictions = JSON.parse(output);
        console.log("Predictions:", predictions);

        // Resolve the promise with the parsed predictions
        resolve(predictions);
      } catch (error) {
        // Reject the promise if there's an error parsing the output
        console.error("Failed to parse the prediction output:", error);
        reject(new Error("Failed to parse predictions"));
      }
    });

    // Handle errors from the Python process itself
    python.on("error", (err) => {
      console.error("Failed to start Python process:", err);
      reject(new Error("Failed to start Python process"));
    });
  });
}
