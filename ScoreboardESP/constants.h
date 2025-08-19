// constants.h
#ifndef CONSTANTS_H
#define CONSTANTS_H

namespace SOCKET_EVENTS {
  static const char* GAME_START = "game:start";
  static const char* GAME_UPDATE = "game:update";
  static const char* SCORE_INCREMENT = "score:increment";
  static const char* SCORE_DECREMENT = "score:decrement";
  static const char* SCORE_RESET = "score:reset";
  static const char* GAME_RESET = "game:reset";
  static const char* CLEAR_PERSISTED_STATE = "clear:persisted";
  static const char* SYNC_REQUEST = "sync:request";
  static const char* SYNC_STATE = "sync:state";
}

#endif
