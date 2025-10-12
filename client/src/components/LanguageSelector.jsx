import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = () => {
    const nextLanguage = i18n.language === "tr" ? "en" : "tr";
    i18n.changeLanguage(nextLanguage);
    localStorage.setItem("language", nextLanguage);
  };

  const isTurkish = i18n.language === "tr";

  return (
    <div className="switch">
      <input
        id="language-toggle"
        className="check-toggle check-toggle-round-flat"
        type="checkbox"
        checked={isTurkish}
        onChange={changeLanguage}
      />
      <label htmlFor="language-toggle"></label>
      <span className="on circle-text">
        <img src="/EN.svg" alt="EN" />
      </span>
      <span className="off circle-text">
        <img src="/TR.svg" alt="TR" />
      </span>
    </div>
  );
};

export default LanguageSelector;
