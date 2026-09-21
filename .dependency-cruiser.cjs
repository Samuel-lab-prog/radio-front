const fs = require('node:fs');
const path = require('node:path');

const features = fs
	.readdirSync(path.join(__dirname, 'src/features'), { withFileTypes: true })
	.filter((entry) => entry.isDirectory())
	.map((entry) => entry.name);

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
	forbidden: [
		{
			name: 'no-circular',
			severity: 'error',
			from: {},
			to: { circular: true },
		},
		{
			name: 'no-unresolved',
			severity: 'error',
			from: {},
			to: { couldNotResolve: true },
		},
		{
			name: 'core-is-independent',
			severity: 'error',
			from: { path: '^src/core/' },
			to: { path: '^src/(features|app)/' },
		},
		{
			name: 'features-do-not-compose-app',
			severity: 'error',
			from: { path: '^src/features/' },
			to: { path: '^src/app/' },
		},
		{
			name: 'app-uses-feature-public-contract',
			severity: 'error',
			from: { path: '^src/app/' },
			to: {
				path: '^src/features/',
				pathNot: '^src/features/[^/]+/public/index\\.ts$',
			},
		},
		...features.map((feature) => ({
			name: `public-contract-of-${feature}`,
			severity: 'error',
			from: { path: '^src/features/', pathNot: `^src/features/${feature}/` },
			to: {
				path: `^src/features/${feature}/`,
				pathNot: `^src/features/${feature}/public/index\\.ts$`,
			},
		})),
	],
	options: {
		doNotFollow: { path: 'node_modules' },
		tsPreCompilationDeps: true,
		tsConfig: { fileName: 'tsconfig.app.json' },
	},
};
