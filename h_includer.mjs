import { promises as fs } from 'node:fs';
import path from "node:path";

const

	reIncludeI = /(?<=<!--(.*)@include)(.*?)(?=-->)/gi,
	reIncludeO =  /(?=<!--(.*)@include)(.*?)-->/gi,

	reSCSSI = /(?<=<script(.*)text\/scss(.*)>)(.|\n)*?(?=<\/script>)/gi,
	reSCSSO = /(?=<script(.*)text\/scss(.*)>)(.|\n)*?(<\/script>)/gi,

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

	//console.log(`including '${fn}'`);

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
	}


	if(cmp.scss_inc_files)
	{
		let imps = '\n' + cmp.scss_inc_files.map(f => `@import '${f}';`).join('\n');

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
		let rfn =  path.dirname(baseFN) + '/' + (fn == input_file ? '' : '_') + path.basename(baseFN).replace('.html', '.scss');
		fs.writeFile(rfn, cmp.scss);
	}

	return cmp;
}



function splitSource(str)
{
	const
		ret = { html: str },
		matches = Array.from( str.matchAll(reSCSSO) ),
		match = matches && matches.length ? matches[0] : false;

	if(match)
	{
		ret.scss = match[0].match(reSCSSI)[0];
		ret.html = str.slice(0, match.index) + str.slice(match.index + match[0].length);
	}

	return ret
}

