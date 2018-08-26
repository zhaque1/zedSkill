/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const cookbook = require('./alexa-cookbook.js');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

const SKILL_NAME = 'zedsSkill';
const GET_FACT_MESSAGE = 'Here\'s your fact: ';
const HELP_MESSAGE = 'You can say tell me a programming fact, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const FALLBACK_MESSAGE = 'The programming Facts skill can\'t help you with that.  It can help you discover facts about programming if you say tell me a programming fact. What can I help you with?';
const FALLBACK_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/lambda/data
//=========================================================================================================================================

const data = [
  'The first computer programmer was a female, named Ada Lovelace. ',
  'The first game was created in 1961. Fun facts are that it didn’t earn any money.',
  'The first virus was created in 1983.',
  'The first computer was actually a loom called the Jacquard loom, an automated, mechanical loom, which didn’t use any electricity.',
  'The first high-level (very close to real English that we use to communicate) programming language was FORTRAN. invented in 1954 by IBM’s John Backus.',
  'Computer programming is one of the fastest growing occupations currently',
  'Did you know how many total programming languages? – it’s 688.',
  'Computers run on binary code—written in 1s and 0s—which is very difficult for humans to work with.',
  'C is a low-level programming language that is good for graphics-heavy applications, like games.',
  'Many coding languages share similar basic features.',
  'almost anything powered by electricity uses code.',
  'Javascript is for the web.',
  'There are "low-level" and "high-level" coding languages. Lower-level languages more closely resemble binary code while higher-level languages are easier to code in.',
];

//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'GetNewFactIntent');
  },
  handle(handlerInput) {
    const randomFact = cookbook.getRandomItem(data);
    const speechOutput = GET_FACT_MESSAGE + randomFact;

    return handlerInput.responseBuilder
      .speak(speechOutput)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const FallbackHandler = {
  // 2018-May-01: AMAZON.FallackIntent is only currently available in en-US locale.
  //              This handler will not be triggered except in that locale, so it can be
  //              safely deployed for any locale.
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(FALLBACK_MESSAGE)
      .reprompt(FALLBACK_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetNewFactHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();