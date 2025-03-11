import { useEffect, useState } from "react";
import { getAllCompanies } from "../api/companies";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Company } from "../types/Company";

interface CompanyDropdownProps {
  value: Company | undefined;
  onChange: (e: DropdownChangeEvent) => void;
  className?: string;
  dropdownClassName?: string;
}

const CompanyDropdown = (props: CompanyDropdownProps) => {
  const { value, onChange, className = "", dropdownClassName = "" } = props;

  const [companies, setCompanies] = useState<
    { label: string; value: Company }[]
  >([]);

  useEffect(() => {
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

  return (
    <div className={className}>
      <Dropdown
        id="company"
        value={value}
        options={companies}
        onChange={onChange}
        placeholder="Select your company"
        className={dropdownClassName}
        filter
      />
    </div>
  );
};

export default CompanyDropdown;
