import { useRef, useState, useEffect } from "react";
import Modal from "../public/Modal";
import {
  NumEmployees,
  IndustryType,
  Company,
  State,
} from "../../types/Company";
import { createCompany, updateCompany } from "../../api/companies";
import { useAuth } from "../../contexts/useAuth";
import { Toast } from "primereact/toast";
import { parseErrorResponse } from "../../utils/errorHandler";
import {
  getEmployeesLabel,
  getIndustryLabel,
  getStateLabel,
} from "../../utils/valuesToLabels";
import {
  LuBuilding2, LuMapPin, LuUsers, LuLayers, LuLink,
  LuUpload, LuX, LuSave,
} from "react-icons/lu";

interface NewCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompanyChanged: () => void;
  company?: Company | null;
}

const NewCompanyModal = ({
  isOpen,
  onClose,
  onCompanyChanged,
  company,
}: NewCompanyModalProps) => {
  const { user } = useAuth();
  const toast = useRef<Toast>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState<State | undefined>();
  const [numberOfEmployees, setNumberOfEmployees] = useState<NumEmployees | undefined>();
  const [industry, setIndustry] = useState<IndustryType | undefined>();
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [logoFile, setLogoFile] = useState<File | undefined>();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (company) {
      setCompanyName(company.name);
      setCity(company.city || "");
      setState(company.state);
      setNumberOfEmployees(company.employees as NumEmployees | undefined);
      setIndustry(company.industry as IndustryType | undefined);
      setUrl(company.url || "");
      setLogoPreview(company.logo || null);
    } else {
      resetInputs();
    }
  }, [company, isOpen]);

  const onUrlChange = (lnk: string) => {
    setUrl(lnk);
    if (lnk.length === 0) {
      setIsValidUrl(true);
      return;
    }
    try {
      new URL(lnk);
      setIsValidUrl(true);
    } catch {
      setIsValidUrl(false);
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Please upload a valid image file (JPG or PNG)",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "File size must be less than 5mb",
        });
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetInputs = () => {
    setCompanyName("");
    setCity("");
    setState(undefined);
    setIndustry(undefined);
    setNumberOfEmployees(undefined);
    setUrl("");
    setIsValidUrl(true);
    setLogoFile(undefined);
    setLogoPreview(null);
  };

  const onSave = async () => {
    if (!user || !companyName) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Please fill in the company name",
      });
      return;
    }

    if (url && !isValidUrl) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Please enter a valid URL or leave it empty",
      });
      return;
    }

    try {
      const companyData = {
        name: companyName,
        city: city || undefined,
        state: state,
        employees: numberOfEmployees,
        industry: industry,
        url: url || undefined,
        logo: logoFile,
      };

      if (company) {
        const res = await updateCompany(company._id, companyData);
        if (res.success) {
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Company updated successfully",
          });
          resetInputs();
          onCompanyChanged();
          onClose();
        } else {
          throw new Error(res.error);
        }
      } else {
        const res = await createCompany(companyData);
        if (res.success) {
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Company created successfully",
          });
          resetInputs();
          onCompanyChanged();
          onClose();
        } else {
          throw new Error(res.error);
        }
      }
    } catch (error: unknown) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: `Failed to ${company ? "update" : "create"} company: ${(error as Error).message}`,
      });
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="w-full max-w-2xl max-h-[90vh] rounded-2xl flex flex-col p-0 overflow-hidden"
        useOverlay
        style={{
          background: "linear-gradient(145deg, #1e2433, #1a1f2e)",
          border: "1px solid #2d3748",
        }}
      >
        {/* Gradient top bar */}
        <div className="h-1" style={{ background: "linear-gradient(90deg, #5b8ef4, #7c3aed)" }} />

        <div className="p-6 flex flex-col overflow-hidden max-h-[90vh]">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-lg"
                style={{
                  background: "rgba(91,142,244,0.12)",
                  border: "1px solid rgba(91,142,244,0.25)",
                }}
              >
                <LuBuilding2 className="w-5 h-5 text-[#5b8ef4]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#e8eaed]">
                  {company ? "Edit Company" : "Create New Company"}
                </h2>
                <p className="text-xs text-[#6b7280] mt-0.5">
                  {company ? "Update company information" : "Add a new company to the directory"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#6b7280] hover:text-[#e8eaed] hover:rotate-90 transition-all duration-200"
              style={{ background: "#141920", border: "1px solid #2d3748" }}
            >
              <LuX className="w-4 h-4" />
            </button>
          </div>

          {/* Form - Scrollable */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-5">
            {/* Logo Upload */}
            <div className="flex flex-col items-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoChange}
                accept="image/jpeg,image/jpg,image/png"
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-xl flex flex-col items-center justify-center cursor-pointer border-2 border-dashed transition-all hover:-translate-y-0.5"
                style={{
                  background: "#141920",
                  borderColor: logoPreview ? "#5b8ef4" : "#2d3748",
                }}
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Company logo preview"
                    className="w-full h-full object-contain rounded-xl p-2"
                  />
                ) : (
                  <>
                    <LuUpload className="w-8 h-8 text-[#6b7280] mb-2" />
                    <span className="text-xs text-[#6b7280]">Upload Logo</span>
                  </>
                )}
              </div>
              <span className="text-xs text-[#4b5563] mt-2">
                Recommended: 400×400px • PNG or JPG • Max 5MB
              </span>
            </div>

            {/* Company Name */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                <LuBuilding2 className="w-3.5 h-3.5" />
                Company Name <span className="text-[#f87171]">*</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Google"
                className="w-full p-2.5 rounded-lg text-sm text-[#e8eaed] outline-none transition-all"
                style={{
                  background: "#141920",
                  border: "1px solid #2d3748",
                }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#5b8ef4"}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#2d3748"}
              />
            </div>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                  <LuMapPin className="w-3.5 h-3.5" />
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., Mountain View"
                  className="w-full p-2.5 rounded-lg text-sm text-[#e8eaed] outline-none transition-all"
                  style={{
                    background: "#141920",
                    border: "1px solid #2d3748",
                  }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#5b8ef4"}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#2d3748"}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                  <LuMapPin className="w-3.5 h-3.5" />
                  State
                </label>
                <select
                  value={state || ""}
                  onChange={(e) => setState(e.target.value as State | undefined)}
                  className="w-full p-2.5 rounded-lg text-sm text-[#e8eaed] outline-none transition-all cursor-pointer"
                  style={{
                    background: "#141920",
                    border: "1px solid #2d3748",
                  }}
                  onFocus={e => (e.target as HTMLSelectElement).style.borderColor = "#5b8ef4"}
                  onBlur={e => (e.target as HTMLSelectElement).style.borderColor = "#2d3748"}
                >
                  <option value="" style={{ background: "#141920" }}>Select state</option>
                  {Object.values(State).map((value) => (
                    <option key={value} value={value} style={{ background: "#141920" }}>
                      {getStateLabel(value)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Employees & Industry */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                  <LuUsers className="w-3.5 h-3.5" />
                  Employees
                </label>
                <select
                  value={numberOfEmployees || ""}
                  onChange={(e) => setNumberOfEmployees(e.target.value as NumEmployees | undefined)}
                  className="w-full p-2.5 rounded-lg text-sm text-[#e8eaed] outline-none transition-all cursor-pointer"
                  style={{
                    background: "#141920",
                    border: "1px solid #2d3748",
                  }}
                  onFocus={e => (e.target as HTMLSelectElement).style.borderColor = "#5b8ef4"}
                  onBlur={e => (e.target as HTMLSelectElement).style.borderColor = "#2d3748"}
                >
                  <option value="" style={{ background: "#141920" }}>Select range</option>
                  {Object.values(NumEmployees).map((opt) => (
                    <option key={opt} value={opt} style={{ background: "#141920" }}>
                      {getEmployeesLabel(opt)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                  <LuLayers className="w-3.5 h-3.5" />
                  Industry
                </label>
                <select
                  value={industry || ""}
                  onChange={(e) => setIndustry(e.target.value as IndustryType | undefined)}
                  className="w-full p-2.5 rounded-lg text-sm text-[#e8eaed] outline-none transition-all cursor-pointer"
                  style={{
                    background: "#141920",
                    border: "1px solid #2d3748",
                  }}
                  onFocus={e => (e.target as HTMLSelectElement).style.borderColor = "#5b8ef4"}
                  onBlur={e => (e.target as HTMLSelectElement).style.borderColor = "#2d3748"}
                >
                  <option value="" style={{ background: "#141920" }}>Select industry</option>
                  {Object.values(IndustryType).map((ind) => (
                    <option key={ind} value={ind} style={{ background: "#141920" }}>
                      {getIndustryLabel(ind)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Website URL */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
                <LuLink className="w-3.5 h-3.5" />
                Website URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => onUrlChange(e.target.value)}
                placeholder="https://www.example.com"
                className="w-full p-2.5 rounded-lg text-sm text-[#e8eaed] outline-none transition-all"
                style={{
                  background: "#141920",
                  border: isValidUrl ? "1px solid #2d3748" : "1px solid #f87171",
                }}
                onFocus={e => (e.target as HTMLInputElement).style.borderColor = isValidUrl ? "#5b8ef4" : "#f87171"}
                onBlur={e => (e.target as HTMLInputElement).style.borderColor = isValidUrl ? "#2d3748" : "#f87171"}
              />
              {!isValidUrl && (
                <p className="text-xs text-[#f87171] mt-1.5">Please enter a valid URL</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t" style={{ borderColor: "#2d3748" }}>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[#9ca3af] hover:text-[#e8eaed] transition-all"
              style={{ background: "#141920", border: "1px solid #2d3748" }}
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={!companyName}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: companyName
                  ? "linear-gradient(135deg, #5b8ef4, #7c3aed)"
                  : "#2d3748",
                boxShadow: companyName
                  ? "0 4px 14px rgba(91,142,244,0.25)"
                  : "none",
              }}
            >
              <LuSave className="w-4 h-4" />
              {company ? "Save Changes" : "Create Company"}
            </button>
          </div>
        </div>
      </Modal>

      <Toast ref={toast} />
    </>
  );
};

export default NewCompanyModal;