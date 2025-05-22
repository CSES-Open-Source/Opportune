import { useCallback, useEffect, useState } from "react";
import { getAllCompanies } from "../api/companies";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Company } from "../types/Company";
import { FaPlus } from "react-icons/fa6";
import NewCompanyModal from "./CompanyModal";

const defaultLogo = "/assets/defaultLogo.png";

interface CompanyDropdownProps {
  value: Company | undefined;
  onChange: (e: DropdownChangeEvent) => void;
  className?: string;
  dropdownClassName?: string;
  buttonClassName?: string;
}

const OptionTemplate = (option: { label: string; value: Company }) => {
  return (
    <div className="flex justify-center items-center">
      <div className="flex justify-center items-center w-6 h-6 mr-2 rounded-sm overflow-hidden">
        <img alt={option.value.name} src={option.value.logo || defaultLogo} />
      </div>
      <div>{option.value.name}</div>
    </div>
  );
};

const CompanyDropdown = (props: CompanyDropdownProps) => {
  const {
    value,
    onChange,
    className = "",
    dropdownClassName = "",
    buttonClassName = "",
  } = props;

  const [companies, setCompanies] = useState<
    { label: string; value: Company }[]
  >([]);

  const [isOpen, setIsOpen] = useState(false);

  const fetchCompanies = useCallback(async () => {
    getAllCompanies().then((response) => {
      if (response.success) {
        setCompanies(
          response.data.map((company) => {
            return { label: company.name, value: company };
          }),
        );
      }
    });
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return (
    <div className={`${className} flex flex-row gap-1`}>
      <Dropdown
        id="company"
        value={value}
        options={companies}
        onChange={onChange}
        placeholder="Select your company"
        className={`${dropdownClassName} flex-grow`}
        itemTemplate={OptionTemplate}
        filter
      />
      <button
        onClick={() => setIsOpen(true)}
        className={`${buttonClassName} p-1 bg-green-600 hover:bg-green-700 rounded-md flex justify-center items-center transition`}
      >
        <FaPlus size={20} className="text-white" />
      </button>
      <NewCompanyModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCompanyChanged={() => fetchCompanies()}
      />
    </div>
  );
};

export default CompanyDropdown;
