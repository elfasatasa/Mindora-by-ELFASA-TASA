import { useTranslations } from "next-intl";



export const translate = (value: string): string => {
    const translate = useTranslations()
  return translate(value) ;
};
