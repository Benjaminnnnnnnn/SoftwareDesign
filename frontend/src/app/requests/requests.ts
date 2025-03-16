import axios from "axios";

// In case we change the address, it'll be easy to modify where all the requests go.
const backend = "http://127.0.0.1:8000";
const board = "/board";
const user = "/user";

// uploads a user's current board as a string to the database.
export async function uploadBoard(
  boardstr: string,
  diff: number,
): Promise<void> {
  try {
    const response = await axios.post(
      backend + board + "/add",
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
  } catch (e) {}
}

// Gets a board of the given stage (difficulty);
export async function fetchBoard(stage: number): Promise<string> {
  let data: string = "";
  try {
    // Looks ugly but this makes a request which expects <string>, and then uses axios's .then() to extract the board string.
    const response = await axios
      .get<string>(backend + board + "/generate/" + String(stage))
      .then((res) => {
        data = res.data;
      });
  } catch (e) {
    console.error("Could not fetch board", e);
  }
  return data;
}

// Registeres a user, not sure about this tho cause the endpoint has no password field
export async function register(
  username: string,
  password: string,
): Promise<void> {
  try {
    const response = await axios.post<string, boolean>(
      backend + user + "/register",
      {
        username: username,
        password: password,
      },
    );
  } catch (e) {
    console.error("Could not register user", e);
  }
}

// CHeck if a user exsists in the db;
export async function checkUser(username: string): Promise<boolean> {
  let success: boolean = false;
  try {
    const response = await axios
      .get<boolean>(backend + user + "/check-user/" + username)
      .then((res) => {
        success = res.data;
      });
  } catch (e) {
    console.error("COuld not check user", e);
  }
  return success;
}

// Call to the backend purely for testing.
export async function testcall() {
  const response = await axios.get(backend + "/");
  console.log("hi", response);
}
