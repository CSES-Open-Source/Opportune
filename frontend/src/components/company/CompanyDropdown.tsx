import { useCallback, useEffect, useState } from "react";
import { getAllCompanies } from "../../api/companies";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Company } from "../../types/Company";
import NewCompanyModal from "./CompanyModal";
import { LuPlus } from "react-icons/lu";

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
    <div className="flex items-center py-2 px-3 hover:bg-[#1e2433] transition-colors rounded-lg">
      <div 
        className="flex items-center justify-center w-8 h-8 mr-3 rounded-lg overflow-hidden border flex-shrink-0"
        style={{
          background: "#141920",
          borderColor: "rgba(91,142,244,0.3)",
        }}
      >
        <img 
          alt={option.value.name} 
          src={option.value.logo || defaultLogo} 
          className="w-6 h-6 object-contain"
        />
      </div>
      <div className="text-[#e8eaed] font-medium">{option.value.name}</div>
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
    <div className={`${className} flex flex-row items-center gap-2`}>
      <Dropdown
        id="company"
        value={value}
        options={companies}
        onChange={onChange}
        placeholder="Select your company"
        className={`${dropdownClassName} flex-grow`}
        style={{
          background: "#141920",
          border: "1px solid #2d3748",
          color: "#e8eaed",
        }}
        itemTemplate={OptionTemplate}
        panelClassName="dark-dropdown-panel"
        filter
        filterPlaceholder="Search companies..."
      />
      <button
        onClick={() => setIsOpen(true)}
        className={`${buttonClassName} inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg transition-all hover:-translate-y-0.5 text-white`}
        style={{
          background: "linear-gradient(135deg, #10b981, #34d399)",
          boxShadow: "0 2px 8px rgba(16,185,129,0.25)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(16,185,129,0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(16,185,129,0.25)";
        }}
      >
        <LuPlus className="w-4 h-4" />
        New
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