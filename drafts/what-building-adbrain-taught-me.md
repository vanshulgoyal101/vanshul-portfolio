---
title: "What Building AdBrain Taught Me Before Anyone Paid"
slug: "what-building-adbrain-taught-me"
summary: "I built an AI ad tool for local businesses. It works. Nobody outside my team uses it yet. Here is what that gap taught me about demand, trust and other people's money."
date: "1 Nov, 2026"
readTime: "6 min read"
category: "Startups"
---

AdBrain is an AI tool that makes and runs Facebook and Instagram ads for local businesses. It has been live at adbrain.vanshul.com since August. It writes the ads, launches the campaign, watches the spend and reports results in plain language.

It also has no outside customers yet. When I last counted, in late October, every account on it was internal or a test. I want to write down what building it has taught me anyway, because most of the lessons came from that gap between a product that works and a product someone wants.

## How I picked this idea

Before AdBrain I built a lot of small tools. Developer utilities, a URL-to-markdown reader, a context tool for coding agents. They worked. None of them could ever have been a business. Each one was a free utility in a category already owned by free or well-funded incumbents, with no way to charge and no way to reach buyers. Even at perfect execution, they would have failed by construction.

So I wrote down four filters and made every new idea pass them before I wrote any code:

1. AI applied to a domain where I have some unfair insight.
2. A warm customer I can actually reach.
3. A non-technical buyer who can't build it themselves and pays quickly.
4. Something I can build alone in 90 days.

These filters killed more ideas than they kept. Health-AI tooling for AI startups died on the third filter, because technical buyers build that kind of thing themselves. Robotics and space died on the fourth. Cold outreach software for solopreneurs died when I noticed my reason for it was a guess about a competitor's weakness that I had no evidence for. Solopreneurs are also the classic trap of a market: cheap, churny and fond of doing it themselves.

What survived was boring. Local businesses around me were already spending real money on Facebook ads every month, and many of them were paying agencies 15 to 30 percent of that spend to run them. That one fact covered most of what my earlier ideas had lacked. The money was already moving. The buyers were people I could meet in person. None of them was going to build software.

I knew the trade I was making. Meta gives away AI ad creative for free, and there are funded companies doing AI ads at scale. AdBrain is hard to defend as pure software. I took better access in exchange for worse defensibility, because for a first project I wanted something real people pay for more than something clever.

## Making an ad is not the hard part

The first version of AdBrain was built for solar businesses. Soon after, I rebuilt it to work for any local business. That forced me to separate two things I had blurred together.

One is the business itself: what it sells, where, to whom, how it sounds, what its photos look like. I call this the brand brain. It is filled in once, partly from the business's own website, and then rarely changes.

The other is this week's goal. A festival offer, a slow month, a new service. That changes all the time.

Keeping them apart sounds like a database decision. It turned out to be the product decision. Generating a decent ad is now close to free; Meta will do it for you. What a local owner actually struggles with is the question that comes back every week: what should I say now? If the tool has to relearn the business every time, answering that question means explaining the business all over again, so the owner doesn't do it. If the business is already known, the weekly question shrinks to one choice. The guided flow asks one question at a time, with tappable answers and an option to let the AI decide.

I now think a lot of AI products for small businesses are aimed at the wrong job. They compete to make the thing. The owner's problem is deciding, again and again, what the thing should say, and doing it without becoming a marketer.

## When software touches someone else's money

Most software that fails wastes time. Ad software that fails spends money. Once I saw that difference, it changed how I built almost everything.

Every campaign AdBrain creates starts paused. Building an ad and spending money on it are two separate decisions, and the second one always belongs to the owner. There is a weekly spend cap. The app refuses to switch on a campaign that would go over it, and it can pause a campaign automatically when the cap is reached. The newer launch flow asks for the cap to be enforced on Meta's side as well, so a bug in my code can't overspend.

The subtle lesson came from a change we rejected. A proposed spend monitor read missing spend data as zero spend. It sounds harmless. In practice it meant the guard could not tell "nothing was spent" from "I don't know what was spent," and it paused campaigns that had done nothing wrong. A guard that fires on bad data is not safe. It is just wrong in a different direction, and an owner who sees their ads stop for no reason stops trusting the tool as surely as one who gets overcharged.

A local owner can't read my code. Whether to trust me is the whole decision for them. So when unsure, the default has to be that nothing happens, and the guard has to know the difference between bad news and no news.

## A working demo is not demand

AdBrain is built by a team of AI agents, each in a defined role, with me setting direction. It is very productive. In one stretch the team shipped about 200 pull requests in three days.

At about the same time I counted real users. All of them were internal or test accounts. A team merging dozens of changes a day had no outside customer, and when I looked at the queue, most of it was internal tooling. My instinct that we were working on low-value things was right, and it took minutes to check. I should have checked earlier.

This is the trap I most need to be honest about. I have never had a paying customer or a pre-sale on any project. I have no logged conversations with potential buyers. I tell myself my strength is selling and my gap is traction, and yet most of my hours go into building. Building feels like progress because it produces visible output every day. Selling, at the start, mostly produces silence. So I drift toward building.

A demo proves I can make something. It says almost nothing about whether anyone will change their week to use it. The rule I keep rewriting for myself is to count customers before ranking work, and to treat a finished feature with no user as inventory, not progress.

The one product lesson I trust most so far points the same way. For local service businesses here, a lot of the loss seems to happen after the click. People tap through to WhatsApp and then don't send a message. Better ad copy alone doesn't fix that. I only learned it because something was actually running.

## Consent before case studies

The obvious next step for a tool like this is a case study: a real business, real spend, real enquiries. I don't have one I can publish, and I've decided that's how it should be for now.

The rule I wrote is simple. Ask the owner on the day you start. Offer two levels: numbers only with the business described generically, or their name and a quote they have read first. Publish only what they approve, and take it down within a day if they change their mind. Never extrapolate a short test into a monthly promise, and always show how small the sample is.

This costs me marketing in the short run. But a local owner's results are their business, not my content. If the first thing I do with someone's trust is turn it into an advertisement for myself, I've told every future customer what I'll do with theirs.

## Where this leaves me

AdBrain works, and that's the easy part. Whether local businesses want it, and will pay for it after seeing what it costs them per enquiry, is still unproven. That's the next thing to find out, and it will be found out by talking to owners rather than by writing more code.

The gap between building something and someone wanting it is wider than it looks from inside the code. I've known that for a while. AdBrain is the first time I've measured it.
