import { useContext, useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import UserContext from "../../Hooks/UserContext";
import axios from "../../config/api/axios";
import { FaUniversity } from "react-icons/fa";
import { PiStudentThin, PiUserThin, PiSpinnerGapBold } from "react-icons/pi";
import CircleDesign from "../Layouts/CircleDesign";
import ErrorStrip from "../ErrorStrip";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [error, setError] = useState("");
  const [buttonText, setButtonText] = useState("Login");
  const [message, setMessage] = useState("");

  const slowLoadingIndicator = () => {
    setTimeout(() => {
      setMessage(
        "NOTE: Web Services on the free instance type are automatically spun down after 15 minutes of inactivity. When a new request for a free service comes in, Render spins it up again so it can process the request. This will cause a delay in the response of the first request after a period of inactivity while the instance spins up."
      );
    }, 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (userType === "") {
      setError({
        response: {
          data: "Select User Type",
        },
      });
    } else {
      setButtonText("Loading...");
      slowLoadingIndicator();
      try {
        const response = await axios.post("/auth/login/" + userType, {
          username,
          password,
        });
        await setUser({ ...response.data, userType });
        localStorage.setItem(
          "userDetails",
          JSON.stringify({ ...response.data, userType })
        );
      } catch (err) {
        setError(err);
        setButtonText("Login");
      }
    }
  };

  useEffect(() => {
    if ("userDetails" in localStorage) {
      setUser(JSON.parse(localStorage.getItem("userDetails")));
    }
    setUserType("");
    setMessage("");
  }, [setUserType, setMessage, setUser]);

  return (
    <>
      {!user?._id ? (
        <main className="relative flex h-screen flex-col items-center justify-center bg-black text-white font-poppins">
          {message && !error && (
            <header className="absolute top-0 w-full bg-white/50 p-2 text-xs text-center text-black lg:text-base">
              {message}
            </header>
          )}
          <CircleDesign />
          <section className="z-10 mb-8 flex items-center text-4xl md:text-6xl">
            <FaUniversity />
            <h1 className="ml-4 font-semibold text-lg md:text-2xl">
              Pinnacle Group Tuitions
            </h1>
          </section>
          <section className="z-10 w-[85%] max-w-lg rounded-lg bg-white p-6 shadow-md hover:shadow-lg text-black">
            <form onSubmit={handleLogin} className="space-y-6">
              <section className="flex flex-col items-center">
                <div className="flex w-full text-lg">
                  <label
                    className={`radio flex w-1/2 cursor-pointer flex-col items-center p-4 ${userType === "staff" ? "bg-gray-300 text-black" : "bg-gray-100"} rounded-tl-lg border border-gray-300`}
                    htmlFor="staff"
                  >
                    Staff
                    <input
                      className="hidden"
                      type="radio"
                      value="staff"
                      id="staff"
                      name="userType"
                      onClick={() => setUserType("staff")}
                    />
                  </label>
                  <label
                    className={`radio flex w-1/2 cursor-pointer flex-col items-center p-4 ${userType === "student" ? "bg-gray-300 text-black" : "bg-gray-100"} rounded-tr-lg border border-gray-300`}
                    htmlFor="student"
                  >
                    Student
                    <input
                      className="hidden"
                      type="radio"
                      value="student"
                      id="student"
                      name="userType"
                      onClick={() => setUserType("student")}
                    />
                  </label>
                </div>
                <div className="flex w-full justify-center p-4 text-8xl text-gray-700">
                  {userType === "student" ? (
                    <PiStudentThin className="rounded-full border-2 border-gray-700 p-2" />
                  ) : userType === "staff" ? (
                    <PiUserThin className="rounded-full border-2 border-gray-700 p-2" />
                  ) : (
                    <FaUniversity className="rounded-lg border-2 border-gray-700 p-2" />
                  )}
                </div>
              </section>
              <section className="px-4 pb-4">
                {userType ? (
                  <>
                    <input
                      className="mb-4 block h-10 w-full rounded-md border-2 border-gray-300 p-2 outline-none focus:border-black"
                      placeholder="Username"
                      id="username"
                      type="text"
                      required
                      autoComplete="off"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                      className="mb-4 block h-10 w-full rounded-md border-2 border-gray-300 p-2 outline-none focus:border-black"
                      placeholder="Password"
                      id="password"
                      type="password"
                      required
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="mb-2 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-black text-white font-bold hover:bg-gray-700 disabled:cursor-wait"
                      type="submit"
                      value="Login"
                      disabled={buttonText !== "Login"}
                    >
                      {buttonText !== "Login" && (
                        <PiSpinnerGapBold className="animate-spin" />
                      )}
                      {buttonText}
                    </button>
                  </>
                ) : (
                  <p className="my-8 text-center bg-gray-100 p-4 rounded text-black">
                    Select User Type
                  </p>
                )}
                {error && <ErrorStrip error={error} />}
                <p className="inline text-gray-600">Click to </p>
                <button
                  type="button"
                  className="font-semibold text-black underline hover:no-underline"
                  onClick={() => navigate("./register/reg_student")}
                >
                  Register
                </button>
              </section>
            </form>
          </section>
        </main>
      ) : (
        <Navigate to="./dash" />
      )}
    </>
  );
};

export default Login;
