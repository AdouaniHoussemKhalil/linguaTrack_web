export const StringHelper = {
  formatTwoDigits: (value: string | number) => {
    return String(value).padStart(2, "0");
  },

  getFirstWords: (text: string, count: number = 10): string => {
    const words = text.trim().split(/\s+/);

    if (words.length <= count) {
      return text;
    }

    return words.slice(0, count).join(" ") + "...";
  },
  formatDate: (dateString: string): string => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  },
};
