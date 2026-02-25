import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import ConfirmationClient from './ConfirmationClient';

interface PageProps {
  params: { locale: string; id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ConfirmationPage({ params, searchParams }: PageProps) {
  unstable_setRequestLocale(params.locale);

  return <ConfirmationClient locale={params.locale} searchParams={searchParams} />;
}