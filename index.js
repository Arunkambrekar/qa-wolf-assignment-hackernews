const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://news.ycombinator.com/newest", {
    timeout: 60000,
    waitUntil: "domcontentloaded",
  });

  let previousCount = 0;

  while (true) {
    const currentCount = await page.$$eval("span.age > a", (anchors) => anchors.length);
    console.log(`Currently loaded: ${currentCount} articles`);

    if (currentCount >= 100) break;

    if (currentCount === previousCount) {
      console.error("❌ More button didn't load new articles. Exiting to avoid infinite loop.");
      await browser.close();
      return;
    }

    previousCount = currentCount;

    const moreButton = await page.$("a.morelink");
    if (!moreButton) {
      console.error("Reached end of page, but fewer than 100 articles were found.");
      await browser.close();
      return;
    }

    await moreButton.scrollIntoViewIfNeeded();
    await moreButton.click();
    await page.waitForTimeout(3000);
  }

  const times = await page.$$eval("span.age > a", (anchors) =>
    anchors.slice(0, 100).map((a) => a.innerText)
  );

  function parseTimeToMinutes(text) {
    const [value, unit] = text.split(" ");
    const num = parseInt(value);
    if (unit.startsWith("minute")) return num;
    if (unit.startsWith("hour")) return num * 60;
    if (unit.startsWith("day")) return num * 1440;
    return Infinity;
  }

  const timeValues = times.map(parseTimeToMinutes);
  console.log("Extracted time values (in minutes):", timeValues);

  const isSorted = timeValues.every(
    (time, i, arr) => i === 0 || arr[i - 1] <= time
  );

  if (isSorted && timeValues.length === 100) {
    console.log("✅ The first 100 articles are sorted from newest to oldest.");
  } else {
    console.error("❌ The articles are NOT correctly sorted.");
  }

  await browser.close();
}

// ✅ Run the function inside an async wrapper
(async () => {
  await sortHackerNewsArticles();
})();
