"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
describe('Rooms routes', () => {
    it('return 401 if accessing protected rooms route with no token', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get('/rooms');
        expect(response.status).toBe(401);
    }));
    it('return 200 if valid token is provided when accessing rooms route', () => __awaiter(void 0, void 0, void 0, function* () {
        const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzI2MjEzNzQyLCJleHAiOjE3MjYyMTczNDJ9.Sj2SFskB8XxA5krGuZT1sNO8QOQSSfEWIicRONWysUU';
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/rooms')
            .set('Authorization', `Bearer ${validToken}`);
        expect(response.status).toBe(200);
    }));
});
