import { promises as fs } from 'node:fs';
import path from "node:path";


const
	input_file = '_index.html',
	output_file = 'src/index.html',
	bPath = path.dirname(path.resolve(input_file)),
	rPath =  'src/';

const res = await readInclude(input_file, rPath);

await fs.writeFile(output_file, res.src);

function fnPath(fn)
{
	return fn.split('/').slice(0,-1).join('/') + '/';
}

async function readInclude(fn)
{
	let
		src = (await fs.readFile(rPath + fn)).toString(),
		cps = src.split('<script type="text/scss">'), // extract scss first
		cp = cps[1],
		scss = '',
		scss_file;

	if(cp)
	{
		cp = cp.split('</script>'); //.slice(1).join('</script>')
		scss = cp[0];

		let
			vp = fnPath(fn).split('/').slice(1).map(p => '..').join('/').replace('../', './');

		scss = `@import '${vp}/_vars.scss';\n` + scss;

		src = cps[0] + cp.slice(1).join('') + cps.slice(2).join('');
	}

	let res = await parse(src, fn);

	if(res.scss_files && res.scss_files.length)
	{


		let imps = '\n' + res.scss_files.map(f => `@import '${f.replace(fnPath(fn), '')}';`).join('\n');
	//let imps = '\n' + res.scss_files.map(f => `@import '${f}';`).join('\n');


		console.log(`\n\n -- ${fn} imps -- ${imps} scss files `, res.scss_files);

		if(scss)
		{
			if(scss.indexOf('/*-h-include-*/') > -1)
				scss = scss.replace('/*-h-include-*/', imps)
			else
				scss += imps;
		}
		else
			scss = imps;
	}

	if(scss)
	{
		scss_file = fnPath(fn) + '_' + path.basename(fn).split('.html')[0] + '.scss';
		fs.writeFile(rPath + scss_file, scss);
	//	scss_file = path.resolve(rPath + scss_file).replace(bPath, '');

	}

	return {
		src: res.src,
		scss_file: scss_file
	};
}

async function parse(src, rootf = '')
{
	let rootp = fnPath(rootf)

	const parts = src.split('<h-include');

	let p, scss_files = [];

	for(let idx = 1; p = parts[idx]; idx++)
	{
		if (p)
		{
			let fn, ie, is = p.indexOf('src');

			is = p.indexOf('"', is + 1) + 1;
			ie = p.indexOf('"', is + 1);

			fn = p.slice(is, ie);

			p = p.split('>').slice(1).join('>').split('</h-include>').slice(1).join('</h-include>');

			let
				c = await readInclude(rootp + fn);

			parts[idx] = c.src + p;

			if(c.scss_file) scss_files.push(c.scss_file);

			//console.log(`part ${idx}: ${parts[idx]}\n`)
			//process.exit();
		}
	}

	return{
		src: parts.join(''),
		scss_files: scss_files
	}
}

