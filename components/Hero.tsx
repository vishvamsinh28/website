import React from 'react';

import { HeadingLevel, HeadingTypeStyle } from '@/types/typography/Heading';

import { useTranslation } from '../utils/i18n';
import Button from './buttons/Button';
import AnnouncementHero from './campaigns/AnnouncementHero';
import Features from './features';
import Heading from './typography/Heading';
import Container from './layout/Container';
import Sponsors from './sponsors/Sponsors';

interface HeroProps {
  className?: string;
}

/**
 * @description This component displays the hero section on the Home page.
 *
 * @param {HeroProps} props - The props for Hero Component.
 * @param {string} props.className - Additional CSS classes for styling.
 */
export default function Hero({ className = '' }: HeroProps) {
  const { t } = useTranslation('landing-page');

  return (
    <>
      <AnnouncementHero className='my-4' />
      <header className={`mt-12 px-2 ${className}`}>
        <div className='text-center'>
          <Heading level={HeadingLevel.h1} typeStyle={HeadingTypeStyle.xl} className='mb-4'>
            {t('main.header')} <span className='block md:-mt-4'> {t('main.subHeader')}</span>
          </Heading>
          <Heading
            level={HeadingLevel.h2}
            typeStyle={HeadingTypeStyle.bodyLg}
            textColor='text-gray-700'
            className='mx-auto mb-10 max-w-4xl'
          >
            {t('main.body_pretext')} <strong>{t('main.body_boldtext')}</strong>
            {t('main.body_posttext')}
          </Heading>
          <div className='flex flex-col items-center justify-center gap-2 md:flex-row'>
            <Button
              className='block w-full md:w-auto'
              text={t('main.join_btn')}
              href='/slack-invite'
              icon={""}
              data-testid='Join-Button'
            />
            <h1 className='m-2'>OR</h1>
            <Button
              className='block w-full md:w-auto bg-white text-blue-500 border border-blue-500 hover:bg-white'
              text={t('main.subscribe_btn')}
              href=''
              icon={""}
              data-testid='Subscribe-Button'
            />
          </div>
        </div>
        <div className='relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-blue-100 mt-16'>
          <Container className='text-center p-6' wide>
            <Heading level={HeadingLevel.h3} typeStyle={HeadingTypeStyle.lg} className='mb-4'>
              {t('sponsors.diamondTitle')}
            </Heading>
            <Sponsors className='mt-4' showSupportBanner={false} />
          </Container>
        </div>
        <Features />
      </header>
    </>
  );
}
