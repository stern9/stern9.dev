import { useState } from "react";
import { HiOutlineChatAlt2 } from "react-icons/hi";

const Form = () => {
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });

  const [inputs, setInputs] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const handleResponse = (status, msg) => {
    if (status === 200) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: msg },
      });
      setInputs({
        fullName: "",
        email: "",
        message: "",
      });
    } else {
      setStatus({
        info: { error: true, msg: msg },
      });
    }
  };

  const handleOnChange = (e) => {
    e.persist();
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    setStatus({
      submitted: false,
      submitting: false,
      info: { error: false, msg: null },
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }));
    const res = await fetch("/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputs),
    });
    const text = await res.text();
    handleResponse(res.status, text);
  };

  return (
    <div className="grid max-w-screen-xl grid-cols-1 gap-8 px-8 py-16 mx-auto rounded-lg md:grid-cols-2 md:px-12 lg:px-16 xl:px-32 bg-gray-500 dark:bg-gray-900 text-white-300 dark:text-red-100">
      <div className="flex flex-col">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold leading-tight lg:text-5xl">
            Let's talk!
          </h2>
          <div className="dark:text-coolGray-400">
            Go ahead and send me a message.
          </div>
        </div>
        <HiOutlineChatAlt2 className="w-60 h-60 pt-5" />
      </div>
      <form
        onSubmit={handleOnSubmit}
        noValidate=""
        className="space-y-6 ng-untouched ng-pristine ng-valid"
      >
        <div>
          <label htmlFor="fullName" className="text-sm">
            Full name
          </label>
          <input
            className="w-full p-3 rounded dark:bg-coolGray-800"
            id="fullName"
            type="text"
            placeholder="Name..."
            onChange={handleOnChange}
            required
            value={inputs.fullName}
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm">
            Email
          </label>
          <input
            className="w-full p-3 rounded dark:bg-coolGray-800"
            id="email"
            type="email"
            onChange={handleOnChange}
            required
            placeholder="your@email.com"
            value={inputs.email}
          />
        </div>
        <div>
          <label htmlFor="message" className="text-sm">
            Message
          </label>
          <textarea
            className="w-full p-3 rounded dark:bg-coolGray-800"
            id="message"
            rows="3"
            id="message"
            onChange={handleOnChange}
            required
            value={inputs.message}
            placeholder="Your message..."
          ></textarea>
        </div>
        <button
          className="w-full mt-10 py-2 px-4 border-2 border-white text-white uppercase text-sm tracking-24 bg-transparent hover:bg-white hover:text-gray-900 transition duration-150 ease-in-out"
          type="submit"
          disabled={status.submitting}
        >
          {!status.submitting
            ? !status.submitted
              ? "Send"
              : "Sent"
            : "Sending..."}
        </button>
        <div className="mt-4">
          {status.info.error && (
            <div className="bg-red-200 border-red-600 text-red-600 border-l-4 p-4">
              <p className="font-bold">
                Ooops - something not ideal might be happening.{" "}
              </p>
              <p>{status.info.msg}</p>
            </div>
          )}
          {!status.info.error && status.info.msg && (
            <div className="bg-green-200 border-green-600 text-green-600 border-l-4 p-4">
              <p className="font-bold">Success</p>
              <p>{status.info.msg}</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Form;
