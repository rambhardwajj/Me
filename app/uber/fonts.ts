import { Archivo, Inter } from 'next/font/google';

// Two voices: Archivo (75% width) for page headlines, Inter for everything else. Shared by every /uber page.
const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const FONTS = `${archivo.variable} ${inter.variable}`;
