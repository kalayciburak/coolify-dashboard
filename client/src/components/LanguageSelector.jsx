import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: "tr", name: "TR", flag: "fi fi-tr" },
    { code: "en", name: "EN", flag: "fi fi-us" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const changeLanguage = () => {
    const nextLanguage = i18n.language === "tr" ? "en" : "tr";
    i18n.changeLanguage(nextLanguage);
    localStorage.setItem("language", nextLanguage);
  };

  return (
    <button
      onClick={changeLanguage}
      className="language-toggle"
      data-lang={i18n.language}
    >
      <span className={`flag-icon ${currentLanguage.flag}`}></span>
      <span className="lang-text">{currentLanguage.name}</span>
    </button>
  );
};

export default LanguageSelector;
