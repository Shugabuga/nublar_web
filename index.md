---
layout: default
title:  "Nublar"
date:   2022-01-24 16:00:00 -0500
categories: nublar
tags: Nublar
copyleft: mit
---

<h1 style="text-align: center">Nublar</h1>

<p style="text-align:center;font-style:italic">A Chromium fork that doesn't suck.</p>

---

<p style="text-align:center;font-style:italic">Coming whenever it works properly.</p>

---

Nublar is a custom Chromium fork that aims to provive a compromise of compatibility, security,
and privacy. It takes concepts and ideas from several Chromium forks, including
[Brave](https://brave.com),
[Microsoft Edge](https://www.microsoft.com/en-us/edge),
[Ungoogled Chromium](https://github.com/Eloston/ungoogled-chromium), 
and [Thorium](https://github.com/Alex313031/Thorium).

However, most none of these browsers fit my vision of a browser, for various reasons. **So I just made my own.** As one does.

## (Planned) Features

- **Private by default.** Only contacts Google for security features, such as Safe Browsing and hardware
    2FA token support. Your private data stays local.

- **Lightweight, but not bare-bones.** Built-in shortcut-based new tab page, Edge's PDF editor and
    DevTools, and more.

- **Secure by default.** Forces HTTPS, proxies autofill requests, and defaults to higher SSL key lengths.

- **Productive.** Shortcuts when you need them, and additional functionality to make your life easier.

- **Cutting-edge.** Built on Nightly Chromium builds. Perfect for testing new features.

- **All the codecs!** Try to support as many codecs that Chromium supports, including DRM-protected
    content.
    
**Please note that this fork is maintained by a single individual!** If you want to use something that's more bullet-proof, **triage** and select an existing browser.

## Security Disclaimer

**Find a bug that is NOT in Upstream?** Report it to `infosec@shuga.co`.

## Critiques of Other Browsers

- Brave pre-loads a lot of bloat into its browser, including cryptocurrency wallets, the *Brave
Attention Token* (BAT), and flagrant adverts for cryptocurrency exchanges.
    - Brave's integration of BAT was opt-out, meaning they were profiting off of other people's work.
    - Most proof-of-work cryptocurrencies are disasterous for the environment.
    - Cryptocurrencies are, effectively, unregulated ETFs. They aren't usable as currencies because
        of value instability.
    - For more reading, check out [this article](https://absolucy.moe/blog/dont-use-brave/) from a
        friend of mine.

- Microsoft Edge moves tracking from Google to Microsoft, and also has a lot of bloat.
    - Bing Rewards and several Microsoft services are shoehorned into the browser.
    - You cannot change your new tab page natively.
    - The Bing new tab page in Edge has access to your "Recently Visited" sites because of a bug with
        the `chrome` object on its NTP.
    - Bing is highly promoted over other search engines
    - Borderline adware like buy-now-pay-later is bundled into the browser.
    - Microsoft is using Windows to natively, and forcibly, advertise Edge.

- Ungoogled Chromium *indiscriminately* disables Google services, including those that don't track you.
    - Google's Safe Browsing API integration, which does not track you, is conciously removed.
    - Extensions cannot automatically update through Chrome's webstore, opening you up to potential
        vulnerabilities.
    - Several links around the browser are broken because of the compilation process's fear of the
    string "google.com"

- Throium is a good browser overall, and does strike a good balance, but it relies on Google
    services (such as browser sync) a bit more than I'd like.

*But what about Firefox?* Because Firefox uses its own rendering engine, and many web developers
    forget to test in other browsers, compatibility can sometimes be iffy. That, and it
    breaks page rendering on custom Windows (and sometimes GDK) themes.

## FAQ

- **How are you updating this?** Good question. Probably GitHub Actions and something with 
    [Omaha](https://github.com/google/omaha).

- **Why don't you apply patches, a la Ungoogled Chromium, Brave, or Thorium?** It's harder to stay up to date
    with Chromium's main branch with that, especially when I can just have Git handle everything
    for me. Git is just spicy `.patch` files.

- **Does this interact with your infrastructure at all?** The default search engine and home page, *Mayori*, does to anonymize select traffic.
    Domain sinkholing, when appropiate, is also done on a subdomain of `nublar.awoo.dev`.
    
- **What if your free server with 1GB of RAM goes down again?** I'm trying to fix that bug, actually. If you're bothered, just don't use Mayori
    and contact Google/DDG directly.

- **Does anyone use this?** Yes. Me. That's good enough for me.

- **I don't trust you though!** Okay. That's understandable. Check the Git history and/or compile
    it yourself. And if you still are skeptical, skip out on this project.

- **How do I compile this?** [Like upstream.](https://chromium.googlesource.com/chromium/src/+/main/docs/get_the_code.md)
    I don't mess with much; it's a pretty lightweight fork to avoid having to ask for a CVE.

- **How long does it take to compile?** First compile? Like, four hours.

- **But, like, *why?* Seems like a lot of work for a few inconveniences** Because I felt like it.
    I like to work as efficiently as possible, and being able to tweak away mild annoyances is worth it.

- **But isn't just modifying Firefox or Chromium easier AND more efficient?** Yes. But I don't care. I can
    just add custom functionality to the core of my browser if I feel like it.
