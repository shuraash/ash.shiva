import { promises as fs } from 'node:fs';
import path from "node:path";

const

	reIncludeI = /(?<=<!--(.*)@include)(.*?)(?=-->)/gi,
	reIncludeO =  /(?=<!--(.*)@include)(.*?)-->/gi,


	scss_include_there_tag = '/* include-there */';

const
	basePath =  'src/',
	input_file =  '_index.html',
	output_file = 'index.html';

try
{
	const res = await includeFile(input_file);
	await fs.writeFile(basePath + output_file, res.html);
}
catch (err)
{
	console.error(err);
	process.exit(1);
}


async function includeFile(fn, ownerDir = '')
{
	if(ownerDir == '.') ownerDir = '';

//	console.log(`including '${fn}'`);

	let
		baseFN = path.normalize( basePath + ownerDir + '/' + fn),
		fdir = path.dirname(fn),
		cmp = splitSource( (await fs.readFile( baseFN  )).toString() ),
	    match,
		matches = cmp.html.matchAll(reIncludeO);


	if(fdir && fdir != '.' && fdir + '/' != basePath) ownerDir = path.normalize(ownerDir + path.dirname(fn));

	for ( match of matches )
	{
	    let
		    ifn = match[0].match(reIncludeI)[0].trim(),
		    icmp = await includeFile(  ifn , ownerDir ) ;

		cmp.html = cmp.html.replace(match[0], '\n' + icmp.html + '\n');

		if(icmp.scss_file)
		{
			if(!cmp.scss_inc_files) cmp.scss_inc_files = [];
			cmp.scss_inc_files.push(icmp.scss_file);
		}

		if(icmp.js_file)
		{
			if(!cmp.js_inc_files) cmp.js_inc_files = [];
			cmp.js_inc_files.push(icmp.js_file);
		}
	}


	if(cmp.scss_inc_files)
	{

		let imps = '\n' + cmp.scss_inc_files.map(f =>
							{
								let p = f.split('/'), pc = p.filter(s => s != '.');
								if(pc.length > 1)
								{
									let bn = pc.pop();
									return `@import '${pc.join('/') + '/scss/' + bn}';`;
								}
								else return `@import '${p.join('/')}';`
							})
							.join('\n');

		if(cmp.scss)
		{
			if(cmp.scss.indexOf(scss_include_there_tag) > -1)
				cmp.scss = cmp.scss.replace(scss_include_there_tag, imps)
			else
				cmp.scss += imps;
		}
		else
		{
			cmp.scss = imps;
		}
	}

	if(cmp.scss)
	{
		cmp.scss_file =  path.dirname(fn) + '/' +  (fn == input_file ? '' : '_')  + path.basename(fn).replace('.html', '.scss')
		let rfn =  path.dirname(baseFN) + '/' + (fn == input_file ? '' : 'scss/_') + path.basename(baseFN).replace('.html', '.scss');
		fs.writeFile(rfn, cmp.scss);
	}

	if(cmp.js_inc_files)
	{
		let imps = '\n' + cmp.js_inc_files.map(f =>
		{
			let p = f.split('/'), pc = p.filter(s => s != '.');
			if(pc.length > 1)
			{
				let bn = pc.pop();
				return `import './${pc.join('/') + '/js/' + bn}';`;
			}
			else return `import '${p.join('/')}';`
		})
		.join('\n');

		// if(fn == 'components/wrapper.html')
		// {
		// 	console.log(cmp.js_inc_files, imps);
		// 	process.exit();
		// }

		if(cmp.js)
		{
			if(cmp.js.indexOf(scss_include_there_tag) > -1)
				cmp.js = cmp.js.replace(scss_include_there_tag, imps)
			else
				cmp.js += imps;
		}
		else
		{
			cmp.js = imps;
		}
	}

	if(cmp.js)
	{
		cmp.js_file =  path.dirname(fn) + '/' +  (fn == input_file ? '' : '_')  + path.basename(fn).replace('.html', '.js')
		let rfn =  path.dirname(baseFN) + '/' + (fn == input_file ? '' : 'js/_') + path.basename(baseFN).replace('.html', '.js');
		fs.writeFile(rfn, cmp.js);
	}


	return cmp;
}



function splitSource(str)
{
	const
		reSCSSI = /(?<=<script(.*)text\/scss(.*)>)(.|\n)*?(?=<\/script>)/gi,
		reSCSSO = /(?=<script(.*)text\/scss(.*)>)(.|\n)*?(<\/script>)/gi,

		reJSI = /(?![^>]+src)(?<=<script(.*)module(.*)>)(.|\n)*?(?=<\/script>)/gi,
		reJSO = /(?![^>]+src)(?=<script(.*)module(.*)>)(.|\n)*?(<\/script>)/gi,

		ret = { html: str };

	let
		matches = Array.from( str.matchAll(reSCSSO) ),
		match = matches && matches.length ? matches[0] : false;

	if(match)
	{
		ret.scss = match[0].match(reSCSSI)[0];
		ret.html = str.slice(0, match.index) + str.slice(match.index + match[0].length);
	}

	str = ret.html;
	matches = Array.from( str.matchAll(reJSO) );
	match = matches && matches.length ? matches[0] : false;

	if(match)
	{
		ret.js = match[0].match(reJSI)[0];
		ret.html = str.slice(0, match.index) + str.slice(match.index + match[0].length);
	}


	return ret
}

