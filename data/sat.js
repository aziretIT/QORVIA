export const satSections = [
  { id: 'math', label: 'Math', icon: 'sat', description: 'Solve problems in algebra, data analysis, geometry, and more.' },
  { id: 'reading-writing', label: 'Reading & Writing', icon: 'book', description: 'Interpret short passages and practice editing for meaning and clarity.' },
];

export const satTopics = {
  math: ['Algebra', 'Advanced Math', 'Problem-Solving and Data Analysis', 'Geometry and Trigonometry'],
  'reading-writing': ['Information and Ideas', 'Craft and Structure', 'Expression of Ideas', 'Standard English Conventions'],
};

export const satQuestions = {
  math: [
    {
      topic: 'Algebra', difficulty: 'Easy',
      prompt: 'A bike rental costs $6 plus $4 for each hour rented. Daria paid $26. How many hours did she rent the bike?',
      options: ['5 hours', '4 hours', '6 hours', '8 hours'], answer: 0,
      explanation: 'Subtract the $6 base charge from $26. The $20 that remains covers 20 ÷ 4 = 5 hours.',
    },
    {
      topic: 'Algebra', difficulty: 'Medium',
      prompt: 'A line passes through (2, 7) and (6, 19). What is the y-intercept of the line?',
      options: ['−1', '1', '3', '5'], answer: 1,
      explanation: 'The slope is (19 − 7) ÷ (6 − 2) = 3. Substituting (2, 7) into y = 3x + b gives 7 = 6 + b, so b = 1.',
    },
    {
      topic: 'Algebra', difficulty: 'Hard',
      prompt: 'For which value of k does the system 6x − 9y = 12 and 4x + ky = 10 have no solution?',
      options: ['−6', '−9', '6', '9'], answer: 0,
      explanation: 'The lines must be parallel and distinct. Multiplying the first equation by 2/3 gives 4x − 6y = 8. With k = −6, the left sides match and the constants differ.',
    },
    {
      topic: 'Advanced Math', difficulty: 'Easy',
      prompt: 'For f(x) = x² − 3x, what is f(−2)?',
      options: ['−10', '−2', '2', '10'], answer: 3,
      explanation: 'Substituting −2 gives (−2)² − 3(−2) = 4 + 6 = 10.',
    },
    {
      topic: 'Advanced Math', difficulty: 'Medium',
      prompt: 'A quadratic function has zeros at −2 and 5 and a leading coefficient of 2. Which expression represents the function?',
      options: ['2(x + 2)(x − 5)', '2(x − 2)(x + 5)', '(2x + 2)(2x − 5)', '2(x − 2)(x − 5)'], answer: 0,
      explanation: 'The factor for a zero r is (x − r). The factors here are (x + 2) and (x − 5). Multiplying the product by 2 gives the stated leading coefficient.',
    },
    {
      topic: 'Advanced Math', difficulty: 'Hard',
      prompt: 'The graph of y = x² + 4x + c touches the x-axis at exactly one point. What is the value of c?',
      options: ['−4', '0', '4', '8'], answer: 2,
      explanation: 'Complete the square to get y = (x + 2)² + c − 4. The graph touches the x-axis exactly once when its minimum value c − 4 equals zero.',
    },
    {
      topic: 'Problem-Solving and Data Analysis', difficulty: 'Easy',
      prompt: 'A theater sold 240 tickets. Thirty-five percent were student tickets. How many student tickets did it sell?',
      options: ['72', '80', '84', '120'], answer: 2,
      explanation: 'Convert 35% to 0.35 and multiply: 0.35 × 240 = 84.',
    },
    {
      topic: 'Problem-Solving and Data Analysis', difficulty: 'Medium',
      prompt: 'The mean of 6, 9, 12, and x is 10. What is x?',
      options: ['10', '11', '12', '13'], answer: 3,
      explanation: 'Four values with mean 10 have a total of 40. The three known values sum to 27, so x = 40 − 27 = 13.',
    },
    {
      topic: 'Problem-Solving and Data Analysis', difficulty: 'Hard',
      prompt: 'An item’s price rose by 25% and then fell by 20% from the new price. The final price was $64. What was the original price?',
      options: ['$60.80', '$64.00', '$67.20', '$80.00'], answer: 1,
      explanation: 'A 25% increase uses a factor of 1.25, and a 20% decrease uses 0.80. Their product is 1.00, so the final and original prices are equal.',
    },
    {
      topic: 'Geometry and Trigonometry', difficulty: 'Easy',
      prompt: 'A circle has circumference 18π centimeters. What is its radius in centimeters?',
      options: ['6', '18', '36', '9'], answer: 3,
      explanation: 'Use C = 2πr. Dividing 18π by 2π gives r = 9.',
    },
    {
      topic: 'Geometry and Trigonometry', difficulty: 'Medium',
      prompt: 'In a right triangle, the hypotenuse is 13 and the leg adjacent to angle θ is 5. What is sin θ?',
      options: ['5/12', '5/13', '12/13', '13/12'], answer: 2,
      explanation: 'The opposite leg is √(13² − 5²) = 12. Sine is opposite divided by hypotenuse, which is 12/13.',
    },
    {
      topic: 'Geometry and Trigonometry', difficulty: 'Hard',
      prompt: 'Two similar solid pyramids have volumes 81 and 192 cubic units. What is the ratio of the smaller pyramid’s height to the larger pyramid’s height?',
      options: ['27:64', '9:16', '3:4', '4:5'], answer: 2,
      explanation: 'The smaller-to-larger volume ratio is 81:192 = 27:64. The ratio of linear dimensions is the cube root of the volume ratio, so the height ratio is 3:4.',
    },
    {
      topic: 'Algebra', difficulty: 'Medium',
      prompt: 'What value of x satisfies x/3 + 7 = x/2 + 2?',
      options: ['10', '18', '30', '54'], answer: 2,
      explanation: 'Multiply both sides by 6 to get 2x + 42 = 3x + 12. Subtract 2x and 12 from both sides to get x = 30.',
    },
    {
      topic: 'Advanced Math', difficulty: 'Hard',
      prompt: 'What is the set of real solutions to √(3x + 10) = x?',
      options: ['{5}', '{−2}', '{−2, 5}', '{2, 5}'], answer: 0,
      explanation: 'Squaring both sides gives x² − 3x − 10 = 0, so (x − 5)(x + 2) = 0. The square root is nonnegative, which rules out −2. Substituting 5 into the original equation gives √25 = 5.',
    },
    {
      topic: 'Problem-Solving and Data Analysis', difficulty: 'Medium',
      prompt: 'Of 24 students in a class, 15 play an instrument, 9 play a sport, and 6 do both. If one student is selected at random, what is the probability that the student plays an instrument or a sport or both?',
      options: ['1/4', '1/2', '5/8', '3/4'], answer: 3,
      explanation: 'Adding 15 and 9 counts the 6 students who do both twice. Subtract 6 to get 18 students who do at least one activity. The probability is 18/24 = 3/4.',
    },
    {
      topic: 'Geometry and Trigonometry', difficulty: 'Easy',
      prompt: 'A sector of a circle with radius 6 centimeters has a central angle of 120°. What is its area in square centimeters?',
      options: ['4π', '12π', '18π', '36π'], answer: 1,
      explanation: 'The sector covers 120/360, or one-third, of the circle. One-third of π × 6² is 12π.',
    },
  ],
  'reading-writing': [
    {
      topic: 'Information and Ideas', difficulty: 'Easy',
      prompt: 'Passage: When a local gallery moved its opening time from noon to 9 a.m., artists reported that more commuters stopped in on their way to work. Weekend attendance stayed about the same. Which statement is best supported by the passage?',
      options: ['Attendance rose most on weekends.', 'The gallery started selling more art.', 'Commuters visited more often after the change.', 'Artists requested shorter opening hours.'], answer: 2,
      explanation: 'The artists directly reported an increase in visits from commuters. The passage gives no sales data or reason why the hours changed.',
    },
    {
      topic: 'Information and Ideas', difficulty: 'Medium',
      prompt: 'Passage: A ceramics class tested two clay mixes. During drying, just one of the twelve tiles made with Mix A cracked, as opposed to five of the twelve tiles made with Mix B. After firing, all uncracked tiles from both mixes were judged equally strong. Which conclusion is best supported?',
      options: ['Every fired tile had identical dimensions.', 'Mix A had fewer cracks during drying in this test.', 'Mix B made the strongest tiles after firing.', 'Mix B required a lower firing temperature.'], answer: 1,
      explanation: 'The drying results show one crack for Mix A and five for Mix B. The strength comparison concerned only the uncracked tiles, and temperature and dimensions are unstated.',
    },
    {
      topic: 'Information and Ideas', difficulty: 'Hard',
      prompt: 'Passage: In a small trial, hikers reading trail histories on paper recalled more names the next day than hikers who heard the same histories aloud. The researchers noted that readers could go back to an earlier paragraph, while listeners heard each segment only once. Why should the trial be repeated before drawing a conclusion about the effect of text versus audio?',
      options: ['The two groups had different opportunities to revisit the information.', 'Only the audio group learned the histories while hiking.', 'The readers were asked to remember fewer names than the listeners.', 'The researchers changed the wording between the two formats.'], answer: 0,
      explanation: 'The ability to review differs alongside the presentation format. A follow-up could allow both groups to revisit the material to isolate the effect of format.',
    },
    {
      topic: 'Craft and Structure', difficulty: 'Easy',
      prompt: 'Sentence: The community workshop will pilot the bicycle repair course with six students before offering it more widely. As used here, what does “pilot” most nearly mean?',
      options: ['Guide through the air', 'Test on a small scale', 'Repair with better tools', 'Advertise to a new group'], answer: 1,
      explanation: 'Offering the course to just six people before expanding it indicates a small initial trial.',
    },
    {
      topic: 'Craft and Structure', difficulty: 'Medium',
      prompt: 'Passage: The abandoned train platform looked useless to many visitors. For local photographers, however, its unusually wide roof provided soft, even light all afternoon. What is the function of the first sentence?',
      options: ['It states an initial impression that the next sentence complicates.', 'It presents a technical term that the next sentence defines.', 'It gives the outcome of an experiment that the next sentence describes.', 'It proposes a solution that the next sentence rejects.'], answer: 0,
      explanation: 'The first sentence gives an unfavorable general impression. The second introduces a group that valued a particular feature of the platform.',
    },
    {
      topic: 'Craft and Structure', difficulty: 'Hard',
      prompt: 'Text 1: Some historic maps show paths now absent from the landscape, making them useful records of changes in how people moved through a city. Text 2: Historical maps can show old routes, but a road that looks important on a map may reflect the mapmaker’s purpose more than its actual use. How would the author of Text 2 most likely respond to Text 1?',
      options: ['By denying that maps ever show abandoned routes', 'By arguing that newer maps always contain more errors', 'By recommending that mapmakers draw fewer important roads', 'By agreeing that maps preserve routes while urging caution about what they imply'], answer: 3,
      explanation: 'Both texts recognize that maps can preserve old routes. Text 2 adds that a map may exaggerate a route’s importance because of the maker’s priorities.',
    },
    {
      topic: 'Expression of Ideas', difficulty: 'Easy',
      prompt: 'The original bench was built from untreated wood and began to split within a year. ____, its replacement was made from a material rated for outdoor use. Which transition most clearly signals the difference between the two benches?',
      options: ['Similarly', 'By contrast', 'For instance', 'Meanwhile'], answer: 1,
      explanation: '“By contrast” marks the change from wood vulnerable to weathering to a material suited to outdoor conditions.',
    },
    {
      topic: 'Expression of Ideas', difficulty: 'Medium',
      prompt: 'A student takes these notes: The Blue Loop is 2 kilometers long. The Green Loop is 4 kilometers long. Both begin at the visitor center. The Blue Loop passes a pond. Which sentence uses the notes to emphasize a similarity?',
      options: ['The Blue Loop is shorter than the Green Loop.', 'At 4 kilometers, the Green Loop is twice the length of the Blue Loop.', 'The Blue Loop passes a pond on its 2-kilometer route.', 'Both the Blue Loop and the Green Loop start at the visitor center.'], answer: 3,
      explanation: 'The starting point is a shared feature. The other choices present length differences or describe only one trail.',
    },
    {
      topic: 'Expression of Ideas', difficulty: 'Hard',
      prompt: 'A student takes these notes: A group observed two school gardens for six weeks. The garden in direct sun needed watering five times per week. The shaded garden needed watering three times per week. Both gardens grew the same herbs in identical containers. Which sentence presents the result while limiting its scope to the observation?',
      options: ['Direct sunlight always doubles how often school gardens need watering.', 'The group used identical containers because shade changes which herbs grow.', 'During the six-week observation, the garden in direct sun needed watering more often than the shaded garden.', 'The gardens prove that growing herbs in shade is the most efficient approach.'], answer: 2,
      explanation: 'The sentence states the observed watering difference and limits the claim to the six-week study. The notes do not establish a universal rule or a conclusion about efficiency.',
    },
    {
      topic: 'Standard English Conventions', difficulty: 'Easy',
      prompt: 'Which choice completes the sentence in standard written English? The box of replacement bulbs ____ on the top shelf.',
      options: ['are', 'be', 'is', 'were'], answer: 2,
      explanation: 'The subject is the singular noun “box.” The phrase “of replacement bulbs” describes the box and does not determine the verb.',
    },
    {
      topic: 'Standard English Conventions', difficulty: 'Medium',
      prompt: 'Which choice correctly completes the sentence? The ferry can carry twelve ____ the smaller water taxi can carry six.',
      options: ['passengers,', 'passengers', 'passengers;', 'passengers and,'], answer: 2,
      explanation: 'A semicolon can join two related independent clauses. A comma alone would create a comma splice.',
    },
    {
      topic: 'Standard English Conventions', difficulty: 'Hard',
      prompt: 'Which choice completes the sentence with a clear modifier? After comparing the two schedules, ____',
      options: ['the shorter route was selected for the field trip.', 'the field trip was assigned to the shorter route.', 'the shorter route seemed easier for the teachers.', 'the teachers chose the shorter route for the field trip.'], answer: 3,
      explanation: 'The subject immediately following the opening phrase must name who compared the schedules. Only “the teachers” can carry out that action.',
    },
    {
      topic: 'Information and Ideas', difficulty: 'Medium',
      prompt: 'In planning a railway exhibit, museum staff expected retired conductors to supply mostly dates and route names. Instead, the conductors described routines such as warming ticket punches before winter shifts and exchanging newspapers at the last stop. The museum redesigned the exhibit around these accounts. Which choice best states the main idea of the passage?',
      options: ['Retired conductors remembered routes more accurately than museum staff.', 'Stories about everyday work changed the museum’s plans for the exhibit.', 'The museum chose to display newspapers because dates were difficult to verify.', 'Winter shifts made it hard for conductors to maintain a fixed schedule.'], answer: 1,
      explanation: 'The passage follows how the conductors’ descriptions of daily routines led the museum to redesign the exhibit. The ticket punches and newspapers are examples of those routines.',
    },
    {
      topic: 'Craft and Structure', difficulty: 'Easy',
      prompt: 'When the composer removed one measure, the director had to adjust the dancers’ timing to accommodate the change. As used in the sentence, what does “accommodate” most nearly mean?',
      options: ['Predict', 'Reverse', 'Publicize', 'Adapt to'], answer: 3,
      explanation: 'The director changed the timing to fit the revised music. In this context, “accommodate” means “adapt to.”',
    },
    {
      topic: 'Expression of Ideas', difficulty: 'Hard',
      prompt: 'A student takes notes about a boat built in 1908. During restoration, workers found green paint beneath the blue coat on the hull. The builder’s 1908 invoice lists a green hull. A 1924 photograph of the boat is black-and-white. Which sentence uses two details from the notes to support a conclusion about the hull’s original color?',
      options: ['The boat was probably painted blue in 1924, when the photograph was taken.', 'The boat was built in 1908 and appears in a black-and-white photograph from 1924.', 'Green paint beneath the blue coat and a 1908 invoice listing a green hull both suggest that the hull was originally green.', 'The builder’s invoice lists a green hull, while the later photograph gives no clear evidence of its color.'], answer: 2,
      explanation: 'The paint layers and the original invoice independently support the conclusion that the hull began green. The black-and-white photograph cannot establish the hull’s color.',
    },
    {
      topic: 'Standard English Conventions', difficulty: 'Medium',
      prompt: 'Which choice completes the sentence in standard written English? The town’s only public kiln ____ will reopen next week.',
      options: [', a brick structure built in 1926,', ', a brick structure built in 1926', 'a brick structure built in 1926,', 'a brick structure built in 1926'], answer: 0,
      explanation: '“A brick structure built in 1926” adds information about the already identified kiln. A pair of commas sets off that extra information.',
    },
  ],
};
