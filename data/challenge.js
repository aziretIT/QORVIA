const vocabulary = [
  ['A team reached a consensus about its next step. What did it reach?', ['A shared agreement', 'A strict deadline', 'An unexpected result', 'A formal complaint'], 'A consensus is an agreement reached by a group.'],
  ['The instructions were ambiguous. What does ambiguous mean?', ['Very detailed', 'Open to more than one interpretation', 'Unnecessarily lengthy', 'Easy to follow'], 'Ambiguous language can be understood in more than one way.'],
  ['Which word means to make something less severe?', ['Measure', 'Exclude', 'Mitigate', 'Predict'], 'To mitigate a problem is to reduce its severity or impact.'],
  ['Mina selected a feasible topic for her project. What makes it feasible?', ['It is entirely new', 'It is widely studied', 'It requires a team', 'It can realistically be completed'], 'A feasible plan is possible with the resources and time available.'],
  ['Which word best completes this sentence? “The historian consulted several sources to ___ the claim.”', ['Verify', 'Reverse', 'Imitate', 'Postpone'], 'To verify a claim is to check whether it is true.'],
  ['The guide offered a concise summary of the exhibition. What was it like?', ['Humorous and informal', 'Short and clear', 'Speculative and personal', 'Long and repetitive'], 'A concise explanation uses few words while preserving the main idea.'],
  ['Which phrase best describes a resilient learner?', ['Someone who avoids unfamiliar tasks', 'Someone who memorizes every page', 'Someone who recovers after setbacks', 'Someone who works only alone'], 'Resilience is the ability to recover or adapt after difficulty.'],
  ['The payment was postponed because the form was incomplete. What happened to the payment?', ['It was split into parts', 'It was confirmed immediately', 'It was reduced', 'It was delayed'], 'Postponing something means moving it to a later time.'],
  ['Which word names the available supply of something?', ['Stock', 'Receipt', 'Branch', 'Estimate'], 'Stock can mean a supply of goods or materials available for use.'],
  ['A researcher wants to derive a rule from many examples. What is the researcher trying to do?', ['Hide the examples', 'Work out the rule from the examples', 'Copy the rule word for word', 'Ignore examples that fit'], 'To derive something is to obtain it from a source or work it out from evidence.'],
  ['What does an impartial referee do?', ['Explains every rule twice', 'Always supports the home team', 'Judges without favoritism', 'Stops the game early'], 'An impartial person makes a judgment without favoring either side.'],
  ['Which word means present but difficult to notice?', ['Fragile', 'Visible', 'Urgent', 'Subtle'], 'A subtle detail can be hard to notice or describe clearly.'],
  ['Which word fits? “The council will ___ funds for the new library.”', ['Allocate', 'Hesitate', 'Conclude', 'Speculate'], 'To allocate funds is to set aside money for a particular purpose.'],
  ['The team inspected the prototype. What did it examine?', ['The sales records', 'An early model of the product', 'The final invoice', 'A list of competitor names'], 'A prototype is an early version made to test a design.'],
  ['Which word describes a view or way of thinking about a situation?', ['Interval', 'Capacity', 'Perspective', 'Sequence'], 'A perspective is a particular way of seeing or thinking about something.'],
  ['Nadia amended the draft after the review. What did she do?', ['Printed it', 'Hid it', 'Accepted it as final', 'Changed it'], 'To amend something is to change it, often to improve or correct it.'],
];

const grammar = [
  ['Which sentence describes a habit?', ['Jules takes the bus every morning.', 'Jules took the bus yesterday.', 'Jules is taking the bus now.', 'Jules will take the bus tomorrow.'], 'The present simple expresses habits and routines.'],
  ['Choose the verb form that describes an action happening now. “The class ___ a debate at the moment.”', ['holds', 'is holding', 'held', 'has held'], 'Use am, is, or are plus the -ing form for an action happening at the moment.'],
  ['Choose the correct form. “We ___ the museum last Friday.”', ['visit', 'have visited', 'visited', 'are visiting'], 'A finished past time such as last Friday calls for the past simple.'],
  ['Choose the correct form. “I ___ this author before, but I can’t remember which book it was.”', ['read tomorrow', 'am reading', 'read yesterday', 'have read'], 'The present perfect describes past experience when the exact time does not matter.'],
  ['Complete the first conditional. “If the library is open, we ___ there.”', ['will meet', 'would meet', 'met', 'had met'], 'A first conditional commonly uses if plus the present simple and will in the result clause.'],
  ['Complete the passive sentence. “The results ___ by the team yesterday.”', ['published', 'were published', 'are publishing', 'had publishing'], 'Use were plus the past participle for a plural subject in the past simple passive.'],
  ['Choose the modal that expresses possibility. “The trail is wet, so it ___ be slippery.”', ['must not', 'has to', 'might', 'used to'], 'Might expresses possibility without certainty.'],
  ['Choose the article. “He made ___ honest mistake.”', ['a', 'the only', 'some', 'an'], 'Use an before a vowel sound. The h in honest is silent.'],
  ['Choose the preposition. “The workshop starts ___ 9:30.”', ['at', 'in', 'on', 'by the'], 'Use at with a precise time of day.'],
  ['Choose the correct word. “There are ___ books on the shelf than yesterday.”', ['less', 'fewer', 'little', 'much'], 'Fewer is used with countable plural nouns, such as books.'],
  ['Complete the sentence. “My sister, ___ lives nearby, is joining us for lunch.”', ['which', 'where', 'who', 'what'], 'Use who to introduce a relative clause about a person.'],
  ['Choose the correct form. “They had packed their bags before the bus ___.”', ['has arrived', 'arriving', 'will arrive', 'arrived'], 'The past perfect marks the earlier action. Use the past simple for the later past event.'],
  ['Choose the correct form. “Neither answer ___ the problem.”', ['solves', 'solve', 'are solving', 'have solved'], 'Neither answer is singular, so the present simple verb ends in -s.'],
  ['Complete the sentence. “I look forward to ___ your ideas.”', ['hear', 'hearing', 'heard', 'will hear'], 'To is a preposition in look forward to, so a following verb takes its -ing form.'],
  ['Complete the sentence. “The room was ___ bright that we could read without a lamp.”', ['very', 'too', 'so', 'enough'], 'Use so plus an adjective and that clause to express a result.'],
  ['Choose the correct form. “If I had more time, I ___ another language.”', ['learn', 'will learn', 'have learned', 'would learn'], 'Use if plus a past form and would in the result clause to imagine a different present situation.'],
];

const logic = [
  (n) => ({
    prompt: `A shelf holds ${n} notebooks. Four shelves are full and one has two notebooks. How many notebooks are there?`,
    options: [4 * n + 2, 5 * n, 4 * (n + 2), n + 6],
    answer: 0,
    explanation: `Multiply ${n} by four for the full shelves, then add two. This gives ${4 * n + 2}.`,
  }),
  (n) => ({
    prompt: `What comes next in the sequence ${n}, ${n + 3}, ${n + 6}, ${n + 9}?`,
    options: [n + 10, n + 12, n + 11, n + 15],
    answer: 1,
    explanation: `Each term increases by three. Add three to ${n + 9} to get ${n + 12}.`,
  }),
  (n) => ({
    prompt: `A ticket costs $${n}. A class buys ten tickets and receives a 20% discount. How much does the class pay?`,
    options: [`$${9 * n}`, `$${2 * n}`, `$${8 * n}`, `$${10 * n}`],
    answer: 2,
    explanation: `The original cost is $${10 * n}. A 20% discount leaves 80% of the original cost, or $${8 * n}.`,
  }),
  (n) => ({
    prompt: `A rectangle is ${n} cm wide and ${n + 5} cm long. What is its perimeter?`,
    options: [`${2 * n + 5} cm`, `${4 * n + 5} cm`, `${2 * n + 10} cm`, `${4 * n + 10} cm`],
    answer: 3,
    explanation: `Add the length and width, then double that sum. The perimeter is ${4 * n + 10} cm.`,
  }),
  (n) => ({
    prompt: `Every attendee with a green badge can enter the studio. Station ${n} is inside the studio. Lee has a green badge. Which statement must be true?`,
    options: [`Lee can enter the studio.`, `Lee must visit station ${n}.`, 'Lee has only one badge.', 'Only Lee can use the studio.'],
    answer: 0,
    explanation: 'The rule grants studio access to everyone who has a green badge. The other statements add information the rule does not give.',
  }),
  (n) => ({
    prompt: `Three friends split ${3 * n} cards equally. One friend gives away two of their cards. How many cards does that friend have left?`,
    options: [n, n - 2, n + 2, 3 * n - 2],
    answer: 1,
    explanation: `Divide ${3 * n} by three to get ${n} cards per friend. Giving away two leaves ${n - 2}.`,
  }),
  (n) => ({
    prompt: `A group has ${n} blue flags and ${2 * n} red flags. What fraction of the flags is blue?`,
    options: ['1/2', '2/3', '1/3', '1/4'],
    answer: 2,
    explanation: `There are ${3 * n} flags altogether. The ${n} blue flags are one of three equal groups.`,
  }),
  (n) => ({
    prompt: `Amira studies ${n} minutes on Monday, ${n + 4} on Tuesday, and ${n + 8} on Wednesday. What is her average study time?`,
    options: [`${n + 8} minutes`, `${n + 2} minutes`, `${n + 6} minutes`, `${n + 4} minutes`],
    answer: 3,
    explanation: `Add the three times and divide by three. The average is ${n + 4} minutes.`,
  }),
];

function fromBank(bank, position) {
  const [prompt, options, explanation] = bank[position];
  return { prompt, options, explanation, answer: position % 4 };
}

export function dailyQuestions(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const dayNumber = Date.UTC(year, month - 1, day) / 86_400_000;
  const vocabularyIndex = dayNumber % vocabulary.length;
  const grammarIndex = (dayNumber * 5 + 3) % grammar.length;
  const mathIndex = (dayNumber * 3 + 5) % logic.length;
  const number = 9 + (dayNumber % 37);
  return [
    { id: 'vocabulary', label: 'Vocabulary', ...fromBank(vocabulary, vocabularyIndex) },
    { id: 'grammar', label: 'Grammar', ...fromBank(grammar, grammarIndex) },
    { id: 'logic', label: 'Logic & math', ...logic[mathIndex](number) },
  ];
}
