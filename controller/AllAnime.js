import cheerio from "cheerio";
import chromium from "chrome-aws-lambda";
import path from 'path'
import { urls } from "../assets/urls.js";
const downloadPath = path.resolve('./download');

export const getAnimeEpisodes = async (req, res) => {
        const anime = "pet"
        const url = `${urls.animeUrl}${anime}`;
        const browser = await chromium.puppeteer.launch({args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: true,
        ignoreHTTPSErrors: true, });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36');
        await page.goto(url);
        const episodes = [];
        const data = await page.evaluate(() => document.querySelector('*').outerHTML);
        const $ = cheerio.load(data)  
        const test = $('.ListCaps').find('.fa-play-circle').each((index, value) => episodes.push({ enlace: value.children[0].attribs.href, imagen: value.children[0].children[0].children[0].attribs['data-src']}))
            await browser.close()
       res.send(episodes)
}
export const getAnimeLink = async (req, res) => {
    const anime = req.params.anime
    const episode = req.params.ep
    const url = `${urls.watchUrl}${anime}/${episode}`
    const browser = await chromium.puppeteer.launch({args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: true,
        ignoreHTTPSErrors: true, });
    const page = await browser.newPage();
    await page.goto(url);
    const elementHandle = await page.$('.player_conte')
    const frame = await elementHandle.contentFrame();
    const video = frame.url()
    await browser.close()
    res.send(video);
}

export const getDowloadLink = async (req, res) => {
    const anime = req.params.anime
    const episode = req.params.ep
    const url = `${urls.downloadUrl}${anime}-episodio-${episode}`
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url);
    const results = [];
    const data = await page.evaluate(() => document.querySelector('*').outerHTML);
    const $ = cheerio.load(data)
    const test = $('.downbtns')['0'].children[1].attribs.href;
    res.send(test)
}