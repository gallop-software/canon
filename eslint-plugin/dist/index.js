"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const no_client_blocks_1 = __importDefault(require("./rules/no-client-blocks"));
const no_container_in_section_1 = __importDefault(require("./rules/no-container-in-section"));
const prefer_component_props_1 = __importDefault(require("./rules/prefer-component-props"));
const prefer_typography_components_1 = __importDefault(require("./rules/prefer-typography-components"));
const speedwell_1 = __importDefault(require("./configs/speedwell"));
const recommended_1 = __importDefault(require("./configs/recommended"));
const plugin = {
    meta: {
        name: 'eslint-plugin-gallop',
        version: '0.1.0',
    },
    rules: {
        'no-client-blocks': no_client_blocks_1.default,
        'no-container-in-section': no_container_in_section_1.default,
        'prefer-component-props': prefer_component_props_1.default,
        'prefer-typography-components': prefer_typography_components_1.default,
    },
    configs: {
        speedwell: speedwell_1.default,
        recommended: recommended_1.default,
    },
};
exports.default = plugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnRkFBcUQ7QUFDckQsOEZBQWtFO0FBQ2xFLDRGQUFpRTtBQUNqRSx3R0FBNkU7QUFDN0Usb0VBQWlEO0FBQ2pELHdFQUFxRDtBQUVyRCxNQUFNLE1BQU0sR0FBRztJQUNiLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxzQkFBc0I7UUFDNUIsT0FBTyxFQUFFLE9BQU87S0FDakI7SUFDRCxLQUFLLEVBQUU7UUFDTCxrQkFBa0IsRUFBRSwwQkFBYztRQUNsQyx5QkFBeUIsRUFBRSxpQ0FBb0I7UUFDL0Msd0JBQXdCLEVBQUUsZ0NBQW9CO1FBQzlDLDhCQUE4QixFQUFFLHNDQUEwQjtLQUMzRDtJQUNELE9BQU8sRUFBRTtRQUNQLFNBQVMsRUFBRSxtQkFBZTtRQUMxQixXQUFXLEVBQUUscUJBQWlCO0tBQy9CO0NBQ0YsQ0FBQTtBQUVELGtCQUFlLE1BQU0sQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBub0NsaWVudEJsb2NrcyBmcm9tICcuL3J1bGVzL25vLWNsaWVudC1ibG9ja3MnXG5pbXBvcnQgbm9Db250YWluZXJJblNlY3Rpb24gZnJvbSAnLi9ydWxlcy9uby1jb250YWluZXItaW4tc2VjdGlvbidcbmltcG9ydCBwcmVmZXJDb21wb25lbnRQcm9wcyBmcm9tICcuL3J1bGVzL3ByZWZlci1jb21wb25lbnQtcHJvcHMnXG5pbXBvcnQgcHJlZmVyVHlwb2dyYXBoeUNvbXBvbmVudHMgZnJvbSAnLi9ydWxlcy9wcmVmZXItdHlwb2dyYXBoeS1jb21wb25lbnRzJ1xuaW1wb3J0IHNwZWVkd2VsbENvbmZpZyBmcm9tICcuL2NvbmZpZ3Mvc3BlZWR3ZWxsJ1xuaW1wb3J0IHJlY29tbWVuZGVkQ29uZmlnIGZyb20gJy4vY29uZmlncy9yZWNvbW1lbmRlZCdcblxuY29uc3QgcGx1Z2luID0ge1xuICBtZXRhOiB7XG4gICAgbmFtZTogJ2VzbGludC1wbHVnaW4tZ2FsbG9wJyxcbiAgICB2ZXJzaW9uOiAnMC4xLjAnLFxuICB9LFxuICBydWxlczoge1xuICAgICduby1jbGllbnQtYmxvY2tzJzogbm9DbGllbnRCbG9ja3MsXG4gICAgJ25vLWNvbnRhaW5lci1pbi1zZWN0aW9uJzogbm9Db250YWluZXJJblNlY3Rpb24sXG4gICAgJ3ByZWZlci1jb21wb25lbnQtcHJvcHMnOiBwcmVmZXJDb21wb25lbnRQcm9wcyxcbiAgICAncHJlZmVyLXR5cG9ncmFwaHktY29tcG9uZW50cyc6IHByZWZlclR5cG9ncmFwaHlDb21wb25lbnRzLFxuICB9LFxuICBjb25maWdzOiB7XG4gICAgc3BlZWR3ZWxsOiBzcGVlZHdlbGxDb25maWcsXG4gICAgcmVjb21tZW5kZWQ6IHJlY29tbWVuZGVkQ29uZmlnLFxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBwbHVnaW5cbiJdfQ==