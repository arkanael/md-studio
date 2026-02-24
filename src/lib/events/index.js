/**
 * index.js
 * MD Studio - Registro Central de Eventos
 *
 * Importa e exporta todos os eventos de scripting do MD Studio.
 * Equivalente ao eventRegistry do GB Studio, adaptado para SGDK/Mega Drive.
 *
 * Para adicionar um novo evento:
 * 1. Crie o arquivo em src/lib/events/eventXxx.js
 * 2. Importe-o aqui
 * 3. Adicione ao array allEvents
 */

// ─── Actor Events ───────────────────────────────────────────────────────────
const { actorActions }                              = require('./eventActorActions');
const { activateActor, deactivateActor }            = require('./eventActorActivateDeactivate');
const { setActorAnimFrame,
        setActorAnimSpeed,
        setActorAnimState }                         = require('./eventActorAnimProperties');
const { playActorAnim, stopActorAnim }              = require('./eventActorAnimate');
const { setActorCollisions }                        = require('./eventActorCollisions');
const { hideActor, showActor }                      = require('./eventActorHideShow');
const { cancelActorMove }                           = require('./eventActorMoveCancel');
const { moveActorRelative }                         = require('./eventActorMoveRelative');
const { moveActorTo }                               = require('./eventActorMoveTo');
const { setActorMovementSpeed }                     = require('./eventActorMovementSpeed');
const { setActorDirection }                         = require('./eventActorSetDirection');
const { setActorPosition }                          = require('./eventActorSetPosition');
const { setActorRelativePosition }                  = require('./eventActorSetRelativePosition');
const { setActorPriority }                          = require('./eventPriority');

// ─── Camera Events ──────────────────────────────────────────────────────────
const { cameraMoveToEvent,
        cameraMoveToLockOnPlayerEvent,
        cameraShakeEvent,
        setCameraBoundsEvent,
        setCameraLockOnPlayerEvent,
        setCameraPositionEvent,
        setCameraPropertyEvent }                    = require('./eventCamera');

// ─── Color / Palette Events ─────────────────────────────────────────────────
const { setColor, fadePalette }                     = require('./eventColor');
const { setPaletteColor, fadePaletteEffect }        = require('./eventPalette');

// ─── Control Flow Events ────────────────────────────────────────────────────
const { callScript, returnFromScript }              = require('./eventControl');
const { ifTrue, ifFalse, switchBlock }              = require('./eventControlFlow');
const { ifVariableCompareTo }                       = require('./eventIfVariableCompareTo');
const { ifVariableValue }                           = require('./eventIfVariableValue');
const { loopRepeat, loopForever, loopWhile }        = require('./eventLoop');
const { endScript, resetGame, goToCredits }         = require('./eventEnd');

// ─── Dialogue Events ────────────────────────────────────────────────────────
const { displayDialogue, displayMenu,
        displayMultipleChoice, drawText,
        closeDialogue,
        setTextAnimSpeed }                          = require('./eventDialogue');

// ─── Engine Fields Events ───────────────────────────────────────────────────
const { engineFieldUpdate,
        engineFieldStore,
        engineFieldReset }                          = require('./eventEngineFields');

// ─── Input Events ───────────────────────────────────────────────────────────
const { inputCheck, inputWait }                     = require('./eventInput');
const { inputCheckAll }                             = require('./eventInputCheck');
const { attachScriptToButton,
        detachScriptFromButton,
        joypadWaitForButton }                       = require('./eventJoypadInput');

// ─── Math Events ────────────────────────────────────────────────────────────
const { mathAdd, mathSub, mathMul,
        mathDiv, mathMod, mathRandom }              = require('./eventMath');

// ─── Miscellaneous Events ───────────────────────────────────────────────────
const { commentEvent, groupEvent,
        lockEvent, labelEvent }                     = require('./eventMisc');

// ─── Music & Sound Events ───────────────────────────────────────────────────
const { playMusic, stopMusic,
        setMusicVolume }                            = require('./eventMusic');
const { playSoundEffect }                           = require('./eventSoundEffect');

// ─── Overlay Events ─────────────────────────────────────────────────────────
const { showOverlay, hideOverlay,
        moveOverlayTo }                             = require('./eventOverlay');

// ─── Plane / Scroll Events ──────────────────────────────────────────────────
const { setPlaneScroll }                            = require('./eventPlane');

// ─── Save Data Events ───────────────────────────────────────────────────────
const { saveGameData, loadGameData,
        clearGameData }                             = require('./eventSaveData');

// ─── Scene Events ───────────────────────────────────────────────────────────
const { changeScene, pushScene,
        popScene }                                  = require('./eventScene');
const { sceneSwitchFade }                           = require('./eventSceneSwitch');

// ─── Screen Events ──────────────────────────────────────────────────────────
const { fadeIn, fadeOut, flashScreen }              = require('./eventScreen');

// ─── Timer Events ───────────────────────────────────────────────────────────
const { idleTimer, waitFrames,
        attachTimer, detachTimer }                  = require('./eventTimer');

// ─── Variable Events ────────────────────────────────────────────────────────
const { setVariable, copyVariable,
        resetVariable }                             = require('./eventVariable');
const { setVariableValue }                          = require('./eventSetVariable');

// ─── Wait Events ────────────────────────────────────────────────────────────
const { waitNFrames }                               = require('./eventWait');

// ─── Text Events ────────────────────────────────────────────────────────────
const { showText }                                  = require('./eventTextShow');

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRO CENTRAL: todos os eventos disponíveis no MD Studio
// ═══════════════════════════════════════════════════════════════════════════
const allEvents = [
  // Actor
  actorActions,
  activateActor, deactivateActor,
  setActorAnimFrame, setActorAnimSpeed, setActorAnimState,
  playActorAnim, stopActorAnim,
  setActorCollisions,
  hideActor, showActor,
  cancelActorMove,
  moveActorRelative,
  moveActorTo,
  setActorMovementSpeed,
  setActorDirection,
  setActorPosition,
  setActorRelativePosition,
  setActorPriority,

  // Camera
  cameraMoveToEvent,
  cameraMoveToLockOnPlayerEvent,
  cameraShakeEvent,
  setCameraBoundsEvent,
  setCameraLockOnPlayerEvent,
  setCameraPositionEvent,
  setCameraPropertyEvent,

  // Color / Palette
  setColor, fadePalette,
  setPaletteColor, fadePaletteEffect,

  // Control Flow
  callScript, returnFromScript,
  ifTrue, ifFalse, switchBlock,
  ifVariableCompareTo,
  ifVariableValue,
  loopRepeat, loopForever, loopWhile,
  endScript, resetGame, goToCredits,

  // Dialogue
  displayDialogue, displayMenu, displayMultipleChoice,
  drawText, closeDialogue, setTextAnimSpeed,

  // Engine Fields
  engineFieldUpdate, engineFieldStore, engineFieldReset,

  // Input
  inputCheck, inputWait,
  inputCheckAll,
  attachScriptToButton, detachScriptFromButton, joypadWaitForButton,

  // Math
  mathAdd, mathSub, mathMul, mathDiv, mathMod, mathRandom,

  // Misc
  commentEvent, groupEvent, lockEvent, labelEvent,

  // Music & Sound
  playMusic, stopMusic, setMusicVolume,
  playSoundEffect,

  // Overlay
  showOverlay, hideOverlay, moveOverlayTo,

  // Plane / Scroll
  setPlaneScroll,

  // Save Data
  saveGameData, loadGameData, clearGameData,

  // Scene
  changeScene, pushScene, popScene,
  sceneSwitchFade,

  // Screen
  fadeIn, fadeOut, flashScreen,

  // Timer
  idleTimer, waitFrames, attachTimer, detachTimer,

  // Variable
  setVariable, copyVariable, resetVariable,
  setVariableValue,

  // Wait
  waitNFrames,

  // Text
  showText,
].filter(Boolean);

/**
 * Mapa de eventos indexado por ID.
 * Uso: const def = eventRegistry['EVENT_CAMERA_MOVE_TO'];
 */
const eventRegistry = allEvents.reduce((acc, evt) => {
  if (evt && evt.id) acc[evt.id] = evt;
  return acc;
}, {});

/**
 * Retorna todos os eventos agrupados por categoria.
 */
function getEventsByGroup() {
  const groups = {};
  allEvents.forEach(evt => {
    if (!evt || !evt.id) return;
    const evtGroups = evt.groups || ['EVENT_GROUP_MISC'];
    evtGroups.forEach(group => {
      if (!groups[group]) groups[group] = [];
      groups[group].push(evt);
    });
  });
  return groups;
}

/**
 * Retorna a definicao de um evento pelo seu ID.
 */
function getEventById(id) {
  return eventRegistry[id] || null;
}

module.exports = {
  allEvents,
  eventRegistry,
  getEventsByGroup,
  getEventById,
};
