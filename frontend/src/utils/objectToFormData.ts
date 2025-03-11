function objectToFormData(
  object: object,
  formData: FormData = new FormData(),
  parentKey: string = "",
): FormData {
  const obj = object as Record<string, unknown>;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const fieldKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value instanceof File || value instanceof Blob) {
        formData.append(fieldKey, value);
      } else if (value instanceof Date) {
        formData.append(fieldKey, value.toISOString());
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          objectToFormData(
            { [`${index}`]: item } as Record<string, unknown>,
            formData,
            fieldKey,
          );
        });
      } else if (value !== null && typeof value === "object") {
        objectToFormData(value as Record<string, unknown>, formData, fieldKey);
      } else if (value !== undefined && value !== null) {
        formData.append(fieldKey, String(value));
      }
    }
  }

  return formData;
}

export default objectToFormData;
