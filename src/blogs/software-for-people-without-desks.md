---
title: "Software for People Without Desks"
slug: "software-for-people-without-desks"
summary: "Most software is built by desk workers for desk workers. The people who run airports, warehouses and sites get the leftovers, and the reason is not what you'd guess."
date: "21 Aug, 2026"
readTime: "6 min read"
category: "Future of Work"
---

Most people who write software sit at a desk. So do most of the people they build it for. That match is so normal we don't notice it.

I notice it because of where I work. I'm an analyst in airport operations at United Airlines, and I build internal tools. An airport runs on people who are almost never at a desk. They work outside, in shifts, in noise, on their feet. Warehouses, construction sites, hospitals and factories are the same. These people keep the physical world running, and the software made for them is usually much worse than the software made for an accountant.

I used to think this was a money problem. Frontline workers earn less, so software for them is worth less. I no longer think that's the main reason. The deeper reason is about who does the work of using the software, and who gets the benefit.

## Who software is built for

Think about what office software assumes. A big screen. A keyboard. Time to read a menu. A login you only type once a day. The freedom to stop, think and come back later.

None of that is true on a ramp, a loading dock or a site. Your hands are busy or gloved. You may share a device with ten other people, or use your own phone. You have a few minutes between tasks, not a quiet hour. If the form has twelve fields, you will fill in the three that matter and guess the rest.

So frontline work still runs on paper, whiteboards, radios and spreadsheets that someone retypes later. People call this backward. I think it's often rational. A clipboard needs no login and no training, and it never pretends to be free. A lot of software that replaces it is worse for the person holding it.

The people designing these tools mostly haven't done the job. That's not a criticism of them. It's just hard to design for a ten-minute break if you have never had one.

## The person who types is not the person who benefits

Here is the part that took me longest to see.

In an office, the person who enters the data usually uses it. You write the email, you send it. You build the spreadsheet, you read it. The cost and the benefit land on the same person, so people care about getting it right.

On the frontline, they are split. The worker records the shift, the inspection, the absence, the checklist. Someone else uses it. A supervisor, a planner, an auditor, a compliance team, a dashboard in an office. The worker pays the cost of entry and gets almost nothing back.

Once you see this, a lot of things make sense. Data quality is poor because nobody at the point of entry has a reason to make it good. Adoption is slow because, for the worker, the software is a tax. And the buyer of the software is almost never the person who has to use it, so the product gets shaped by what the buyer wants to see, not by what the user can stand to do.

This is the real reason frontline software lags. The users and the beneficiaries are different people, and the software is built for the beneficiaries.

## Why compliance software gets gamed

Compliance is where this split hurts the most.

A compliance tool usually works by asking the worker to record more: tick this box, confirm that check, log the reason. Every new rule adds a little friction for the person at the bottom and a little reassurance for the people above.

People respond to that in a predictable way. They fill in the checklist at the end of the shift from memory. They tick every box because unticked boxes cause trouble. There's even a name for signing off on checks that were never really done: pencil-whipping. The records look complete. They just don't describe what happened.

So the more work a compliance system adds for the worker, the less its records can be trusted. Past some point, adding a rule makes you less compliant in fact, while looking more compliant on paper.

The fix is not stricter enforcement. It's asking the worker for less. The best compliance system is one where the worker barely notices it exists, because it takes what they already do and works out the rest.

## What I built

I wanted to test this idea on a real kind of problem, so in June I built a prototype on my own, called bluecollar-attendance-compliance. It's not a product and it has no customers. It's a Python engine with a small JavaScript dashboard.

It deals with attendance for hourly shift workers. Many hourly employers use a "no-fault" point system: you start with a balance of points, each absence or late arrival costs some, the deductions expire after twelve months, and falling below certain thresholds triggers warnings and, eventually, termination. Some absences are legally protected, like leave under the US Family and Medical Leave Act, and must not cost anything.

The design has two parts, and the split between them is the whole point.

The first part is a plain, deterministic rules engine. The policy lives in a config file: what each code costs, when points come back, where the warning lines are. Given the same records, it always gives the same answer, and anyone can check that answer by hand. When the output can cost someone their job, I don't want a model guessing. Fairness on the frontline mostly means predictability. A worker should be able to work out their own standing on the back of an envelope.

The second part uses a language model, but only to assist. It reads the free-text notes that supervisors already write in shift logs and flags anything that might be a protected absence, so a human can review it. It also drafts the brief for a review meeting and the warning letters. It never decides anything.

## Moving the work to the machine

Building it showed me something I hadn't expected.

For decades, software got clean data by forcing structure at the moment of entry. Dropdowns, required fields, validation errors. That made the database tidy, and it put the whole cost of tidiness on the person typing. On the frontline, that person is the one with the least time and the least reason to care.

Language models change where that cost can sit. You can let people write the way they already write, in messy notes and shorthand, and do the structuring afterwards, in the back office, where the beneficiary is. The worker's job gets smaller instead of bigger.

That's why the two-part design matters. Let the model handle the mess at the edges, where people are. Keep the decisions in rules a person can read. Most of the AI products I see do the opposite. They put the model in charge of the judgment and keep the forms for the humans.

I also did something wrong, and it's worth saying. I built the prototype first and only then started thinking about who would pay for it. I've written before about how [judgment matters more than output](/blog/taste-is-the-last-moat/), and this was a lapse in mine. A working engine tells you the problem can be solved. It doesn't tell you anyone will buy the solution. The next step is a conversation with a real buyer, not more code.

## Why the gap stays open

There's a reason this space stays underserved even though it's huge.

Selling to frontline operations is slow. The buyer is far from the user. Unions, labor law and safety rules mean mistakes are expensive, so nobody wants a tool that's "mostly right." And most founders have never worked a shift, so they don't see the problems in the first place. Those are real barriers, and they're also why the space isn't crowded with clones.

The advantage goes to whoever has stood close enough to the work to see who pays for each keystroke. If you build for these workers, start there. Count every tap you ask of them, because each one is a cost paid by someone who gets nothing back for it.
