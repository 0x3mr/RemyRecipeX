import React, { FC, useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
// import { IoChevronBack, IoChevronForward } from "react-icons/io5"; // New import for modern icons
import {
  TbArrowBadgeRightFilled,
  TbArrowBadgeLeftFilled,
} from "react-icons/tb";
import "../assets/stylesheets/Home.css";
import LogoN from "../assets/images/LogoN.png";
import text from "../assets/images/text.png";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import RecipeModal from "./RecipeModal";
import suggestion1 from "../assets/images/suggestion1.png";
import suggestion2 from "../assets/images/suggestion2.png";
import suggestion3 from "../assets/images/suggestion3.png";
import suggestion4 from "../assets/images/suggestion4.png";
import suggestion5 from "../assets/images/suggestion5.png";
import suggestion6 from "../assets/images/suggestion6.png";
import suggestion7 from "../assets/images/suggestion7.png";
import suggestion8 from "../assets/images/suggestion8.png";
import suggestion9 from "../assets/images/suggestion9.png";
import suggestion10 from "../assets/images/suggestion10.png";
import suggestion11 from "../assets/images/suggestion11.png";
import suggestion12 from "../assets/images/suggestion12.png";
import suggestion13 from "../assets/images/suggestion13.png";
import suggestion14 from "../assets/images/suggestion14.png";
import suggestion15 from "../assets/images/suggestion15.png";
import suggestion16 from "../assets/images/suggestion16.png";
import Spinner from "./Spinner";
import { useDispatch, useSelector } from "react-redux";
import { setResponse } from "../state/responseSlice";
import { openResponseDialog } from "../state/dialogSlice";
import { RootState } from "../state/store";
// import { Recipe } from "../lib/types";

const typingTexts = [
  "Let's cook!",
  "What are you thinking of?",
  "Give ingredients, receive recipes!",
  "What's on your mind?",
];

const suggestions = [
  { title: "Chicken Maratha", image: suggestion1 },
  { title: "Sweet & Sour", image: suggestion2 },
  { title: "Bacon", image: suggestion3 },
  { title: "Rice", image: suggestion4 },
  { title: "Cookies", image: suggestion5 }, // Add more suggestions as needed
  { title: "Sushi", image: suggestion6 },
  { title: "Pizza", image: suggestion7 },
  { title: "Shawerma", image: suggestion8 },
  { title: "Crepe", image: suggestion9 },
  { title: "Koshari", image: suggestion10 },
  { title: "Couscous", image: suggestion11 },
  { title: "Steak", image: suggestion12 },
  { title: "Smashed Potatos", image: suggestion13 },
  { title: "Confit Byaldi", image: suggestion14 },
  { title: "Kebab", image: suggestion15 },
  { title: "Molten Cake", image: suggestion16 },
];

const Home: FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const [placeholderText, setPlaceholderText] = useState("");
  // const [recipeData, setRecipeData] = useState<Recipe | null>(null);
  // const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [animationPhase, setAnimationPhase] = useState<
    "typing" | "pause" | "deleting" | "waiting"
  >("typing");
  const [showModal, setShowModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const responseDialog = useSelector( (state: RootState) => state.dialog.responseDialog)
  useEffect(() => {
    async function getName() {
      const res = await fetch("/api/user/profile", {
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      if (data.name) {
        setName(data.name);
        for (let i = 0; i < typingTexts.length; i++) {
          typingTexts[i] = `Hey ${data.name}, ${typingTexts[i]}`;
        }
      }
    }
    async function isValid() {
      fetch("/api/auth/check-session", {
        method: "GET",
        credentials: "include", // Ensures the session cookie is sent with the request
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 1) {
            console.log("User is authenticated");
            setIsLoggedIn(true);
            getName();
          } else {
            console.log("User is not authenticated");
          }
        })
        .catch((error) => console.error("Error:", error));
    }

    isValid();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (inputValue !== "") {
      return;
    }

    let timer: number;

    switch (animationPhase) {
      case "typing":
        if (placeholderText !== typingTexts[textIndex]) {
          timer = window.setTimeout(() => {
            setPlaceholderText(
              typingTexts[textIndex].slice(0, placeholderText.length + 1)
            );
          }, 100);
        } else {
          setAnimationPhase("pause");
        }
        break;

      case "pause":
        timer = window.setTimeout(() => {
          setAnimationPhase("deleting");
        }, 2500);
        break;

      case "deleting":
        if (placeholderText !== "") {
          timer = window.setTimeout(() => {
            setPlaceholderText(placeholderText.slice(0, -1));
          }, 50);
        } else {
          setAnimationPhase("waiting");
        }
        break;

      case "waiting":
        timer = window.setTimeout(() => {
          setTextIndex((prevIndex) => (prevIndex + 1) % typingTexts.length);
          setAnimationPhase("typing");
        }, 500);
        break;
    }

    return () => window.clearTimeout(timer);
  }, [placeholderText, animationPhase, textIndex, inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + suggestions.length) % suggestions.length
    );
  };

  const getVisibleSuggestions = () => {
    const visibleSuggestions = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentIndex + i) % suggestions.length;
      visibleSuggestions.push(suggestions[index]);
    }
    return visibleSuggestions;
  };

  const handleInputFocus = () => {
    if (inputValue === "") {
      setPlaceholderText("");
    }
    if (!isLoggedIn) {
      setShowModal(true);
    }
  };

  const handleInputBlur = () => {
    if (inputValue === "") {
      setAnimationPhase("typing");
    }
  };

  const openRegisterModal = () => {
    setShowModal(false);
    setShowRegisterModal(true);
  };

  const closeRegisterModal = () => {
    setShowModal(true);
    setShowRegisterModal(false);
  };

  // const closeRecipeModal = () => {
  //   setShowRecipeModal(false);
  // };

  const handleModalClose = () => {
    setShowModal(false);
    setShowRegisterModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include", // Necessary to include session cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        // credentials: "same-origin", //only for same-origin requests
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        window.location.href = "/";
      } else {
        console.error("Login failed:", data.message);
        alert(`Login failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
        credentials: "include", // Include credentials to save cookies, only in cross-origin requests
        // credentials: "same-origin", //only for same-origin requests
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Register successful:", data);
        closeRegisterModal();
      } else {
        console.error("Register failed:", data.message);
        alert(`Register failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
    }
  };

  const handleSearchClick = async () => {
    setLoading(true); // Set loading to true when search starts
    try {
      const response = await fetch("/api/gpt/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: inputValue }),
        credentials: "include", // Include credentials to save cookies, only in cross-origin requests
      });

      
      if (response.ok) {
        // console.log("Answer successful:", data);
        dispatch(setResponse(await response.json()));
        dispatch(openResponseDialog())
        // setRecipeData(data); // Store the received data
        setLoading(false); // Stop loading when data is received
        // setShowRecipeModal(true); // Show the modal once data is ready
        // alert(data); //For Testing
      } else {
        const data = await response.json();
        console.error(" failed:", data.message);
        setLoading(false); // Stop loading if the request fails
        alert(` failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setLoading(false); // Stop loading on error
    }
  };
  const handleSuggestionClick = async (title: string) => {
    setLoading(true); // Set loading to true when search starts
    try {
      const response = await fetch("/api/gpt/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: title }),
        credentials: "include", // Include credentials to save cookies, only in cross-origin requests
      });

      
      if (response.ok) {
        // console.log("Answer successful:", data);
        dispatch(setResponse(await response.json()));
        dispatch(openResponseDialog())
        // setRecipeData(data); // Store the received data
        setLoading(false); // Stop loading when data is received
        // setShowRecipeModal(true); // Show the modal once data is ready
        // alert(data); //For Testing
      } else {
        const data = await response.json();
        console.error(" failed:", data.message);
        setLoading(false); // Stop loading if the request fails
        alert(` failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setLoading(false); // Stop loading on error
    }
  }

  return (
    <div className="homeContainer">
      {/* <img src={Logo} alt="Logo" className="homeLogo" /> */}
      <img src={LogoN} alt="Logo" className="homeLogoN" />
      <img src={text} alt="Logo" className="homeLogoT" />
      <input
        type="text"
        className="searchBox custom-placeholder"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={inputValue === "" ? placeholderText : ""}
      />
      {inputValue && (
        <div onClick={handleSearchClick}>
          <FaArrowRight className="search-icon" />
        </div>
      )}
      {showModal && (
        <LoginModal
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          onClose={handleModalClose}
          onSubmit={handleSubmit}
          openRegisterModal={openRegisterModal}
        />
      )}
      {showRegisterModal && (
        <RegisterModal
          name={name}
          email={email}
          password={password}
          setName={setName}
          setEmail={setEmail}
          setPassword={setPassword}
          onClose={handleModalClose}
          onSubmit={handleRegisterSubmit}
          openLoginModal={() => {
            setShowRegisterModal(false);
            setShowModal(true);
          }}
        />
      )}
      {/* Loading Spinner */}
      {loading && <Spinner />} {/* Show loading spinner while fetching data */}
      {responseDialog && (
        <>
          {console.log("Modal is being triggered")} Add a debug log
          <RecipeModal />
        </>
      )}
      <div className="suggestionsContainer">
        {getVisibleSuggestions().map((suggestion, index) => (
          <div 
          key={index} className="suggestion"
          onClick={() => handleSuggestionClick(suggestion.title)} // Call the function with suggestion title
          style={{ cursor: 'pointer' }}>
            <h3>{suggestion.title}</h3>
            <img src={suggestion.image} alt={suggestion.title} />
          </div>
        ))}
      </div>
      <button className="sliderButton left" onClick={prevSlide}>
        <TbArrowBadgeLeftFilled />
      </button>
      <button className="sliderButton right" onClick={nextSlide}>
        <TbArrowBadgeRightFilled />
      </button>
    </div>
  );
};

export default Home;
