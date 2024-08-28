/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily :{
				'body': ['"Poppins"','sans-serif']
			},
			colors : {
				'acm-blue' : '#3E6FF4'
			}
		},
	},
	plugins: [],
}
