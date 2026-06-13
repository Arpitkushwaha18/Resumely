import "../builder/builder.css";
import BuilderApp from "../builder/BuilderApp.jsx";
import SEO from "../components/SEO.jsx";

export default function BuilderPage() {
  return (
    <>
      <SEO
        title="Free Resume Builder Online | Create an ATS Resume | Resumely"
        description="Use Resumely's free resume builder to create an ATS-friendly professional resume, customize resume templates, and download a polished PDF in minutes."
        path="/builder"
      />
      <BuilderApp />
    </>
  );
}
