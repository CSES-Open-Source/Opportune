import { useRef, useState, useEffect } from "react";
import Modal from "../public/Modal";
import {
  NumEmployees,
  IndustryType,
  Company,
  State,
} from "../../types/Company";
import { FaLink, FaCloudUploadAlt } from "react-icons/fa";
import { createCompany, updateCompany } from "../../api/companies";
import { useAuth } from "../../contexts/useAuth";
import { Toast } from "primereact/toast";
import {
  getEmployeesLabel,
  getIndustryLabel,
  getStateLabel,
} from "../../utils/valuesToLabels";

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
  const [numberOfEmployees, setNumberOfEmployees] = useState<
    NumEmployees | undefined
  >();
  const [industry, setIndustry] = useState<IndustryType | undefined>();
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [logoFile, setLogoFile] = useState<File | undefined>();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Initialize form when modal opens or company changes
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

    // Only validate URL if one is provided
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
        // Update existing company
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
        // Create new company
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
        detail: `Failed to ${company ? "update" : "create"} company: ${
          (error as Error).message
        }`,
      });
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="max-w-lg w-full rounded-xl bg-white p-6"
        useOverlay
      >
        <h2 className="text-2xl font-bold mb-4">
          {company ? "Edit Company" : "Create New Company"}
        </h2>

        {/* logo upload */}
        <div className="flex flex-col items-center mb-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleLogoChange}
            accept="image/jpeg,image/jpg,image/png"
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
          >
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Company logo preview"
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <>
                <FaCloudUploadAlt size={32} className="text-gray-300" />
                <span className="text-sm text-gray-500 mt-2">Upload Logo</span>
              </>
            )}
          </div>
          <span className="text-xs text-gray-400 mt-1">
            Recommended size: 400×400px. PNG or JPG.
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* company name */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Google"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* city */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Mountain View"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* state */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value as State | undefined)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Select state</option>
              {Object.values(State).map((value) => (
                <option key={value} value={value}>
                  {getStateLabel(value)}
                </option>
              ))}
            </select>
          </div>

          {/* Number of Employees */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Employees
            </label>
            <select
              value={numberOfEmployees}
              onChange={(e) =>
                setNumberOfEmployees(e.target.value as NumEmployees | undefined)
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value={undefined}>Select range</option>
              {Object.values(NumEmployees).map((opt) => (
                <option key={opt} value={opt}>
                  {getEmployeesLabel(opt)}
                </option>
              ))}
            </select>
          </div>

          {/*industry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <select
              value={industry}
              onChange={(e) =>
                setIndustry(e.target.value as IndustryType | undefined)
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value={undefined}>Select industry</option>
              {Object.values(IndustryType).map((ind) => (
                <option key={ind} value={ind}>
                  {getIndustryLabel(ind)}
                </option>
              ))}
            </select>
          </div>

          {/* Website URL */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLink
                  size={18}
                  className={url ? "text-blue-500" : "text-gray-300"}
                />
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => onUrlChange(e.target.value)}
                placeholder="e.g. https://www.google.com"
                className={`w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none ${
                  isValidUrl
                    ? "border-gray-300 focus:border-blue-500"
                    : "border-red-500"
                }`}
              />
            </div>
            {!isValidUrl && (
              <p className="mt-1 text-xs text-red-600">
                Please enter a valid URL.
              </p>
            )}
          </div>
        </div>

        {/* cancel */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {company ? "Save Changes" : "Create Company"}
          </button>
        </div>
      </Modal>

      <Toast ref={toast} />
    </>
  );
};

export default NewCompanyModal;
