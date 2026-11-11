---
title: "What Two YC Rejections Taught Me About Traction"
slug: "two-yc-rejections"
summary: "I applied to Y Combinator twice and was turned down twice. The gap wasn't ideas. It was that nobody had ever paid for anything I built."
date: "8 Nov, 2026"
readTime: "6 min read"
category: "Startups"
---

I applied to Y Combinator twice, for X25 and W26. Both times the answer was no.

YC doesn't send an autopsy, and I won't pretend to know their reasons. But when I put what I had sent them next to what I had actually done, the gap wasn't hard to read. I had ideas. I could build. What I couldn't show was anyone using what I built, let alone paying for it. I read both rejections as a lack of traction, not a lack of ideas.

That sounds like a small distinction. It took me a while to see it was the whole thing.

## The gap was traction, not ideas

When you get rejected, the natural move is to improve the pitch. Sharpen the idea, tighten the framing, make the market look bigger. That fixes the part that wasn't broken.

An idea is a guess about what people want. Traction is evidence. Someone reading a pile of applications can't reliably tell a good guess from a bad one. Nobody can. But anyone can tell evidence from no evidence at a glance. A handful of people who came back on their own says more than a perfect description of a product nobody has touched.

So the useful question wasn't how to make my ideas sound better. It was why, after so much building, I still had nothing to show.

## A hundred ideas are zero ideas

The first answer was uncomfortable. I like keeping options open. By my own count I had about a hundred ideas. I'd go deep on one, find its weak spot, park it and move to the next: a kids' education app meant to replace cartoons, an AI second brain, a hosted proxy for LLM calls, an outreach tool for solopreneurs. Each got a careful analysis and a verdict. None got a customer.

It felt like rigor. It was closer to the opposite. An idea only turns into information when it meets someone who can say no to it. Until then it's a story I'm telling myself, and a hundred stories don't add up to one fact. I started writing "100 ideas = 0 ideas" in my notes to stop myself.

One detail made this sharper. When I went back to audit that claim, only three or four of the ideas were actually written down anywhere. The hundred was a feeling, not a list. That tells you what the ideas were for. They weren't being tested. They were a place to go if the current thing got hard.

Committing to one idea is scary because it can fail clearly. Keeping a hundred open feels safe because none of them ever has to. But nothing gets learned that way, and learning was the only thing I actually needed.

## Building tools nobody could pay for

The second answer took an honest market review to see. In August 2026 I went through every project I'd shipped and checked each one against the incumbents that actually exist.

I had built `ctx`, which turns a repo or its docs into context for coding agents. Context7 already does that and is funded, and gitingest and repomix are free. I had built a URL-to-markdown reader exposed as an MCP server. Jina Reader does that for free and Firecrawl is funded. I had built developer utilities for JSON, regex and cron expressions. Sites like regex101, crontab.guru and jwt.io have owned those searches for about a decade, and they cost nothing.

Each project worked. That was the trap. Looked at together, they had the same shape: a free, static utility with no backend, in a category owned by free or venture-funded incumbents, with no way to charge and no edge in distribution. A project like that can't become a business by construction. Even at 100% technical success there's nobody to pay you and no reason for anyone to pick you over the thing they already use.

Why did I keep making them? Because building is what I'm comfortable with, and these were things I could finish alone. But that meant competing on product in commodity markets, which is where a solo builder has the least advantage. It played to my weakness.

My strengths were somewhere else. I'm reasonably good at business development. In college I led a team of six to NASA's rover challenge and raised the money to get us there. I work in airport operations, a domain most software people never see from the inside. And I know local business owners in India who already spend real money on ads. None of my projects used any of that.

There's a less obvious problem with free tools, too. They can't tell you much. When something costs nothing, using it costs the user nothing, so their behavior is a weak signal. Visits and stars feel like traction, but they're closer to applause. The only test that means much is one where the other person gives something up.

## Activity is not traction

Even after I committed to one project, I fell for a quieter version of the same mistake.

That project is AdBrain, an AI tool that makes and runs ads for local businesses. In late October I stopped and counted customers before deciding what to work on next. There were dozens of merges a day going into it, and zero outside users. I wrote about that separately in [What Building AdBrain Taught Me Before Anyone Paid](/blog/what-building-adbrain-taught-me/).

It looked like momentum. It wasn't pointed at a customer. Shipping is the part I control, so shipping quietly became the thing I measured. That's the same instinct that produced the free tools, just better dressed.

## The fix: small bets, paid for in advance

Here are the rules I work by now.

- Keep the day job and run cheap, reversible experiments. Make the big decisions from evidence, not anxiety.
- Before any code, an idea needs a buyer I can actually reach, who can't build it themselves and already spends money on the problem.
- Validate with pre-payment before building.
- One project, about 40 hours a week, for 90 days. No idea-hopping.

Pre-payment inverts the order I used to work in. I used to build first and look for a buyer after. Now the buyer comes first. If nobody will pay for a clear description of the thing, they probably won't pay for the thing, and I find out in a week instead of three months. This is not a new idea. Paul Graham's [Do Things That Don't Scale](https://paulgraham.com/ds.html) says much the same. I just had to fail at the other way before I believed it.

The insight that took me longest is about risk. I'd always told myself that keeping options open was the careful choice. But I was hedging at the level of ideas, when I should have been hedging at the level of bets. Refusing to commit doesn't lower your risk. It just guarantees you never collect anything. The better way to be careful is to commit fully to one thing while keeping the cost of being wrong small. A steady job, a 90-day window and a pre-sale before code each cap the downside. Inside those limits I can afford to go all in.

## What I still haven't done

It would be dishonest to stop there. As I write this, I have no pre-sale. Not for AdBrain, not for anything. Talking to ten nearby business owners is still on my list, with no conversations logged.

There's a tension in my own plan, too. I say selling is my strength and traction is my gap, and then I schedule 40 hours a week of building. If that diagnosis is right, outreach should be the main activity and the code should follow it. I wrote the rule. I haven't fully followed it yet.

So that's what two rejections taught me, as far as I can tell. I didn't need better ideas or a better way of describing them. I needed to put one idea in front of someone who could say no, and ask them to pay before I felt ready. That part is still ahead of me.
