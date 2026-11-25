export const ieltsSections = [
  { id: 'listening', label: 'Listening', icon: 'headphones', description: 'Follow a conversation or announcement and pick out key details.' },
  { id: 'reading', label: 'Reading', icon: 'book', description: 'Read a short passage and check what the evidence supports.' },
  { id: 'writing', label: 'Writing', icon: 'pencil', description: 'Plan, write, and assess a response to an original prompt.' },
  { id: 'speaking', label: 'Speaking', icon: 'mic', description: 'Develop a spoken answer using timed prompts and a review checklist.' },
];

export const ieltsPractices = {
  listening: [
    {
      id: 'repair-cafe',
      title: 'The repair café',
      context: 'A short announcement about a community event',
      transcript: 'The repair café will open this Saturday at the North Street Library, in the room behind the main desk. You can bring a lamp, a small kitchen appliance, or an item of clothing. Please leave bicycles at home this time, as the outdoor work area is being painted. The first session starts at ten, but anyone bringing electrical equipment should arrive fifteen minutes early for a safety check. The repair is free. If you need a replacement part, the volunteer will tell you where to buy it, and you can bring it back next month.',
      questions: [
        { prompt: 'Where inside the library will the event take place?', options: ['Near the entrance', 'Behind the main desk', 'In an outdoor work area', 'In the reading room'], answer: 1, explanation: 'The speaker gives the precise location immediately after naming the library: the room behind the main desk.' },
        { prompt: 'Which item should visitors leave at home?', options: ['A lamp', 'A jacket', 'A kitchen appliance', 'A bicycle'], answer: 3, explanation: 'Bicycles are excluded because the outdoor work area is being painted. The other three types of item can be brought in.' },
        { prompt: 'When should someone bringing a lamp arrive for the first session?', options: ['9:45 a.m.', '10:00 a.m.', '10:15 a.m.', '10:45 a.m.'], answer: 0, explanation: 'A lamp is electrical equipment, so its owner should arrive fifteen minutes before the session starts at ten.' },
      ],
    },
    {
      id: 'canal-walk',
      title: 'The canal walk',
      context: 'An update for students joining a field trip',
      transcript: 'Hi everyone. Here are the final details for Friday’s field trip. We are still meeting at eight thirty, but please wait outside the station’s west entrance. The east entrance is closer to the canal, so it can seem like the obvious place to go. However, the group leader will only collect students from the west entrance. In the morning, we will use hand-drawn maps to follow the old canal route. After lunch, a local historian will show us how to identify traces of former warehouses. Bring drinking water and something to write with. Lunch is included, and waterproof jackets are available to borrow, as long as you ask before we leave the station.',
      questions: [
        { prompt: 'Where should the students meet the group leader?', options: ['At the canal entrance', 'Outside the east station entrance', 'Outside the west station entrance', 'At an old warehouse'], answer: 2, explanation: 'The east entrance is mentioned as a possible wrong choice. The group leader will collect students only from the west entrance.' },
        { prompt: 'What will students do after lunch?', options: ['Draw maps of the canal', 'Search for clues to former warehouses', 'Collect lunch from the station', 'Interview the group leader'], answer: 1, explanation: 'The afternoon activity is to identify traces of former warehouses with a local historian. The maps are used in the morning.' },
        { prompt: 'What does the speaker ask students to bring themselves?', options: ['A phone with a map', 'A waterproof jacket', 'A packed lunch', 'Drinking water and a writing tool'], answer: 3, explanation: 'Water and something to write with are the items the speaker directly asks students to bring. Lunch is provided, and jackets are available to borrow.' },
      ],
    },
  ],
  reading: [
    {
      id: 'night-garden',
      title: 'A garden after dark',
      context: 'An informational passage about urban pollinators',
      passage: [
        'The courtyard at a small city museum was planted with flowers that attract bees during the day. After noticing moths gathering near the courtyard at dusk, the museum’s gardener added pale-flowered plants that release scent in the evening. She left several existing beds untouched, so volunteers could compare insect visits to similar areas with different planting.',
        'The volunteers counted visitors twice a week for six weeks, recording the hour, temperature, and whether nearby lamps were lit. On warmer evenings, the new beds had more visits than the existing beds. On cold evenings, both received relatively few visitors. Moths were observed even when lamps were off, but the volunteers had not varied lighting systematically, so they could not tell how much the lamps affected the counts.',
        'The gardener plans to repeat the project next year with measurements beginning earlier in spring. She also wants to inspect the beds the following morning. This could reveal whether moth visits leave evidence of pollen transfer, something that a count of insects alone does not establish.',
      ],
      questions: [
        { prompt: 'Why did the gardener leave several existing beds untouched?', options: ['To provide a comparison with the new beds', 'To prevent the lamps from heating the beds', 'To keep the moths away from bees', 'To avoid watering plants in winter'], answer: 0, explanation: 'The first paragraph states that unchanged beds allowed volunteers to compare insect visits to different planting.' },
        { prompt: 'Which conclusion can the volunteers draw from the observations?', options: ['Lamps stopped moths from visiting.', 'Cold evenings led to more visits to the new beds.', 'Moths visited the courtyard without the lamps on.', 'Most of the moth visits occurred earlier in spring.'], answer: 2, explanation: 'The second paragraph explicitly reports moths when lamps were off. The teams did not test lighting systematically, so the size or direction of its effect is unknown.' },
        { prompt: 'What might the planned morning inspections help reveal?', options: ['The average evening temperature', 'Whether the insects transferred pollen', 'The position of the courtyard lamps', 'How many bees visited during spring'], answer: 1, explanation: 'The final paragraph links morning inspections to potential evidence of pollen transfer, a different question from how many insects were seen.' },
      ],
    },
    {
      id: 'seed-library',
      title: 'Seeds to share',
      context: 'An informational passage about a neighborhood program',
      passage: [
        'A neighborhood library began lending small packets of seeds from a cabinet near the entrance. Borrowers could choose up to three packets and take them home without filling out a form. The librarian hoped that this approach would make it easy for people without a garden to try growing herbs or vegetables in containers.',
        'The project initially encouraged borrowers to return new seeds at the end of the growing season. Several gardeners brought some back, but volunteers found that the return system was difficult for beginners to follow. They had to know which plants produced mature seed, when to collect it, and how to dry it. Some seeds arrived damp and had to be discarded.',
        'The team now offers optional seed-saving workshops. The cabinet still has no formal borrowing requirements. Volunteers buy a small batch of reliable seed each spring and use suitable donated seed to add variety. Last year, organizers asked visitors which items they had actually planted. Their answers helped volunteers give more cabinet space to container-friendly crops.',
      ],
      questions: [
        { prompt: 'Who did the librarian particularly hope to help?', options: ['Volunteers buying large seed orders', 'Experienced gardeners collecting rare plants', 'People who wanted to grow plants without a garden', 'Visitors who knew how to dry seeds'], answer: 2, explanation: 'The first paragraph describes helping people without a garden grow plants in containers.' },
        { prompt: 'What problem appeared in the program’s first design?', options: ['Borrowers could take too many packets.', 'Some people returned poorly dried seeds.', 'The cabinet was harder to find in spring.', 'Volunteers had nowhere to hold workshops.'], answer: 1, explanation: 'The passage says that some returned seeds arrived damp, making them unsuitable for reuse.' },
        { prompt: 'How did asking visitors what they planted affect the program?', options: ['The library stopped purchasing seeds.', 'The team made a sign-up form compulsory.', 'Visitors began running the workshops.', 'The cabinet held more crops suited to containers.'], answer: 3, explanation: 'The final paragraph directly connects the survey responses with allocating more space to container-friendly crops.' },
      ],
    },
  ],
  writing: [
    {
      id: 'quiet-study',
      title: 'Making room for quiet study',
      context: 'Academic Writing Task 2-style opinion essay',
      minutes: 40,
      words: 250,
      prompt: 'Some secondary schools are considering keeping a quiet study room open for an additional hour after lessons. Supporters say it gives all students a suitable place to study. Others argue that the money should be spent on better classroom resources. Discuss both views and give your own opinion.',
      review: [
        { criterion: 'Task response', question: 'Did you explain the case for both options and give a clear opinion?' },
        { criterion: 'Coherence', question: 'Does each body paragraph develop one main idea with a reason or example?' },
        { criterion: 'Vocabulary', question: 'Did you use precise terms such as “access to study space” or “teaching materials”?' },
        { criterion: 'Grammar', question: 'Did you check subject–verb agreement and punctuation in longer sentences?' },
      ],
      guidance: 'A strong response might compare access to a quiet room after school with the wider reach of classroom resources. Use a concrete example to show whom each policy helps, then explain which consideration matters most to you.',
    },
    {
      id: 'travel-survey',
      title: 'How students travel',
      context: 'Academic Writing Task 1-style data summary',
      minutes: 20,
      words: 150,
      prompt: 'The table shows the percentage of students who used each main method to travel to a college in 2015 and 2025. Summarize the main features and make comparisons where relevant.',
      table: {
        columns: ['Main method', '2015', '2025'],
        rows: [['Bus', '32%', '38%'], ['Car', '41%', '25%'], ['Walking', '19%', '22%'], ['Bicycle', '8%', '15%']],
      },
      review: [
        { criterion: 'Task achievement', question: 'Did your overview identify the largest changes and the new leading method?' },
        { criterion: 'Coherence', question: 'Did you group related figures into clear comparisons?' },
        { criterion: 'Vocabulary', question: 'Did you distinguish a change in percentage points from a percentage increase?' },
        { criterion: 'Grammar', question: 'Did you use consistent tenses and accurate forms such as “rose from … to …”?' },
      ],
      guidance: 'Look for the overall shift away from private cars, then compare the rise of the bus with the gains for walking and cycling. Include selected figures to support your overview and leave explanations for the changes out of the summary.',
    },
  ],
  speaking: [
    {
      id: 'learning-place',
      title: 'A place where you learn well',
      context: 'Speaking Part 2 cue card and Part 3 follow-up',
      prompt: 'Describe a place where you find it easy to learn something new.',
      cues: ['Say where the place is and when you go there.', 'Describe what helps you concentrate there.', 'Explain what you learned on a particular visit.'],
      followUps: ['What can schools learn from public spaces that are good for studying?', 'How might different students need different places to learn?'],
      review: [
        { criterion: 'Fluency', question: 'Did you connect your ideas and keep speaking through most of the two minutes?' },
        { criterion: 'Vocabulary', question: 'Did you describe the place using specific words and reformulate when you got stuck?' },
        { criterion: 'Grammar', question: 'Did you distinguish general routines from one past visit?' },
        { criterion: 'Pronunciation', question: 'Did you stress key words clearly and pause between groups of ideas?' },
      ],
      guidance: 'Develop one specific example after you describe the place. Connect a detail such as lighting, furniture, or noise level to something you were able to accomplish there.',
    },
    {
      id: 'a-small-change',
      title: 'A small change that helped',
      context: 'Speaking Part 2 cue card and Part 3 follow-up',
      prompt: 'Describe a small change you made to your routine that helped you achieve something.',
      cues: ['Describe your routine before the change.', 'Explain how you decided what to change.', 'Describe the result and whether you kept the change.'],
      followUps: ['Why do people sometimes find it difficult to maintain new habits?', 'How can friends or classmates support someone who wants to learn a new habit?'],
      review: [
        { criterion: 'Fluency', question: 'Did listeners get a clear sequence of before, change, and result?' },
        { criterion: 'Vocabulary', question: 'Did you use language for routines and outcomes, such as “set aside time” or “stay on track”?' },
        { criterion: 'Grammar', question: 'Did you use past forms for events and present forms for habits that continue?' },
        { criterion: 'Pronunciation', question: 'Did your pacing leave time for listeners to understand important details?' },
      ],
      guidance: 'Quantify or illustrate what changed, then explain why the change worked for you. In the follow-up discussion, compare individual motivation with the influence of other people.',
    },
  ],
};
