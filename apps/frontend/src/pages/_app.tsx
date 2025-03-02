// src/pages/_app.tsx
import { ColorScheme, ColorSchemeProvider, Global, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { withTRPC } from '@trpc/next';
import { Analytics } from '@vercel/analytics/react';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { NextIntlProvider } from 'next-intl';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import superjson from 'superjson';
import { RouterTransition } from '../components/RouterTransition';
import type { AppRouter } from '../server/router';

type PageProps = {
	messages: IntlMessages;
	session: Session | null;
	now: number;
};

type Props = Omit<AppProps<PageProps>, 'pageProps'> & {
	pageProps: PageProps;
};

export function App({ Component, pageProps: { session, ...pageProps } }: Props) {
	useEffect(() => {
		console.log(
			'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@/*/(* ,@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@&*///((///*,#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ,(/(((((((//*  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ((((((((((((//* #@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ /(((((((((((((/*(,,@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@,(/((((((((((((((//,*@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@/(/((((((((((((((((///.(@@@@@@@@@@@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#/(/(((((((((((((((((((//,#@@@@@@@@@@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#////(((((((((((((((((((((//,(@@@@@@@@@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@&.*//((((((((((((((((((((((((/(.%@@@@@@@@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ *//(((((((((((((((((((((((((((//(,.@@@@@@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@**(/(((((((((((((((((((((((((((((((/**/*..%@@@@@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#,//(((((((((((((((((((((((((((((((((((((////*./(@@@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@(,//((((((((((((((((((((((((((((((((((((((((((/////,./@@@@@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@..//(((((((((((((((((((((((((((((((((((((((((((((((((////* .@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  ///((((((((((((((((((((((((((((((((((((((((((((((((((((((/(*@@@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@/.///((((((((((((((((((((((((((((((((((((((((((((((((((((/((((//,(@@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%**/((((((((((((((((((((((######((##%%#/((((((((((((((((((((((##(((*,%@\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@@@@# ,(##########((((((/(((((((((((/*,,,,.,,,,...,*((((((((((((((((((((((/(.#\n' +
				'@@@@@@@@@@@@@@@@@@@@@@@,.((/(((((((((((((((((((((((((((*       .,.         .  **,,,,.            ./,\n' +
				'@@@@@@@@@@@@@@@@@@@@# .//(((((((((((((((((((((((((((((((((/*.     *%@@@@@@&(         .        .,(*  \n' +
				'@@@@@@@@@@@@@@@@@@@% *(((((((((((((((((((((((((((((((((((((((((/#@@@@@&&@@@@@@%.          ,%@@@@@@%,\n' +
				'@@@@@@@@@@@@@@@@@@@./((((((((((((((((((((((((((((((((((((((((((((/(((((((####/((((*,..   /@@@@@/,&@@\n' +
				'@@@@@@@@@@@@@@@@@ ,(/((((((((((((((((((((((((((((/(((/((((((((((((((((((((((((((((((((((((%%#(*/*,*%\n' +
				'@@@@@@@@@@@@@@@, ///((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((//(*,@@@@@\n' +
				'@@@@@@@@@@@@@@*.(/((((((((((((((((((((((((((((((((((((((((((((((((//////////////////((((///.%@@@@@@@\n' +
				'@@@@@@@@@@@@@@(((((((((((((((((((((((((((((((((((((/////////////(%&&&@@@@@@@@@&%(//((////*/@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@#/((((((((((((((((((((((((((((((((((((((////////////////////******////////*&@@@@@@@@@@\n' +
				'@@@@@@@@@@@@@@(//(((((((((((((//((//(((((((((((((((((((((((((((((///////((((((((((((/(/.(@@@@@@@@@@@\n' +
				'@@@@@@@@@& ,//#//(((///((((((((((((((((((((///((///(((/(((((((((((((((((///(((((((//(..@@@@@@@@@@@@@\n' +
				'@@@@@@*.#(//(((((((/(########((((((((((((((((((((%%%%#/((((((((((((//(((((/(((((####*..@@@@@@@@@@@@@\n' +
				'@@&,,((//(((((((((((((((((((((((((((((((((((((((((((((((((((#####(((((((((((((((((((//(*.#@@@@@@@@@@\n' +
				'@&.///(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((//,*&@@@@@@@@\n' +
				'@@///((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((/,#@@@@@@@@\n' +
				'@&/((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((/,#@@@@@@@@\n' +
				'@*(/(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((/,#@@@@@@@@\n' +
				'@*(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((/,#@@@@@@@@\n' +
				'@/(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((/*/@@@@@@@@\n' +
				'.((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((//.%@@@@@@@\n' +
				'(*/(/((((((((((((((((((((/********/(((((/((((((((((//((((((((((//((((((((((/(((/((((((/(((/.%@@@@@@@\n' +
				'\n\n>>>>>>>>>>>>>>>>>>>>>>>>>> open source software for allllllll: https://mmattDonk.com <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<'
		);
	}, []);

	const router = useRouter();

	if (router.pathname.split('/')[1] !== 'overlay') {
		return (
			<MantineTheme>
				<RouterTransition />
				<SessionProvider session={session}>
					<NextIntlProvider messages={pageProps.messages}>
						<Component {...pageProps} />
					</NextIntlProvider>
					<Analytics />
				</SessionProvider>
			</MantineTheme>
		);
	} else {
		return (
			<SessionProvider session={session}>
				<Component {...pageProps} />
				<Analytics />
			</SessionProvider>
		);
	}
}

export const getBaseUrl = () => {
	if (typeof window !== 'undefined') {
		return '';
	}
	if (process.browser) return ''; // Browser should use current path
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

	return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
	config({ ctx }) {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */
		const url = `${getBaseUrl()}/api/trpc`;

		return {
			url,
			transformer: superjson,
			/**
			 * @link https://react-query.tanstack.com/reference/QueryClient
			 */
			// queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
		};
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: false,
})(App);

function MantineTheme({ children }: { children: React.ReactNode }) {
	const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');
	const toggleColorScheme = (value?: ColorScheme) => setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

	return (
		<ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
			<MantineProvider theme={{ colorScheme }} withNormalizeCSS withGlobalStyles>
				<NotificationsProvider>
					<Global
						styles={(theme) => ({
							a: {
								color: theme.colorScheme === 'dark' ? theme.colors.dark![0] : theme.colors.gray![7],
								textDecoration: 'underline',

								'&:hover': {
									color: theme.colors[theme.primaryColor]![theme.colorScheme === 'dark' ? 3 : 7],
									textDecoration: 'none',
								},
							},
						})}
					/>
					{children}
				</NotificationsProvider>
			</MantineProvider>
		</ColorSchemeProvider>
	);
}
