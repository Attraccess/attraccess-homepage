import { createContext, useContext } from 'react';
import type { Cam } from './camera';
import type { Locale } from '../i18n';

export type FilmState = { t: number; cam: Cam; portrait: boolean; width: number; height: number; locale: Locale };
export const FilmCtx = createContext<FilmState>({ t: 0, cam: { x: 0, y: 0, zoom: 1 }, portrait: false, width: 1920, height: 1080, locale: 'en' });
export const useFilm = () => useContext(FilmCtx);
