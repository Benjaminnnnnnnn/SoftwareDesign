import axios from "axios";

const backend = "http://127.0.0.1:8000";

export async function uploadBoard(
  boardstr: string,
  diff: number,
): Promise<void> {
  try {
    const response = await axios.post(
      backend + "/board/add",
      {
        difficulty: diff,
        arrangement: boardstr,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response) {
      throw new Error();
    }
  } catch {}
}

export async function testcall() {
  const response = await axios.get(backend + "/");
  console.log("hi", response);
}
