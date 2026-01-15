/**
 * Speedwell template configuration
 * Enables all Gallop rules relevant to the Speedwell architecture
 */
const speedwellConfig = {
    plugins: ['gallop'],
    rules: {
        // Blocks should be server components - extract client logic to components
        'gallop/no-client-blocks': 'warn',
        // Section already provides containment
        'gallop/no-container-in-section': 'warn',
        // Use component props instead of className for style values
        'gallop/prefer-component-props': 'warn',
    },
};
export default speedwellConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlZWR3ZWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZ3Mvc3BlZWR3ZWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUNILE1BQU0sZUFBZSxHQUFHO0lBQ3RCLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUNuQixLQUFLLEVBQUU7UUFDTCwwRUFBMEU7UUFDMUUseUJBQXlCLEVBQUUsTUFBTTtRQUVqQyx1Q0FBdUM7UUFDdkMsZ0NBQWdDLEVBQUUsTUFBTTtRQUV4Qyw0REFBNEQ7UUFDNUQsK0JBQStCLEVBQUUsTUFBTTtLQUN4QztDQUNGLENBQUE7QUFFRCxlQUFlLGVBQWUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3BlZWR3ZWxsIHRlbXBsYXRlIGNvbmZpZ3VyYXRpb25cbiAqIEVuYWJsZXMgYWxsIEdhbGxvcCBydWxlcyByZWxldmFudCB0byB0aGUgU3BlZWR3ZWxsIGFyY2hpdGVjdHVyZVxuICovXG5jb25zdCBzcGVlZHdlbGxDb25maWcgPSB7XG4gIHBsdWdpbnM6IFsnZ2FsbG9wJ10sXG4gIHJ1bGVzOiB7XG4gICAgLy8gQmxvY2tzIHNob3VsZCBiZSBzZXJ2ZXIgY29tcG9uZW50cyAtIGV4dHJhY3QgY2xpZW50IGxvZ2ljIHRvIGNvbXBvbmVudHNcbiAgICAnZ2FsbG9wL25vLWNsaWVudC1ibG9ja3MnOiAnd2FybicsXG5cbiAgICAvLyBTZWN0aW9uIGFscmVhZHkgcHJvdmlkZXMgY29udGFpbm1lbnRcbiAgICAnZ2FsbG9wL25vLWNvbnRhaW5lci1pbi1zZWN0aW9uJzogJ3dhcm4nLFxuXG4gICAgLy8gVXNlIGNvbXBvbmVudCBwcm9wcyBpbnN0ZWFkIG9mIGNsYXNzTmFtZSBmb3Igc3R5bGUgdmFsdWVzXG4gICAgJ2dhbGxvcC9wcmVmZXItY29tcG9uZW50LXByb3BzJzogJ3dhcm4nLFxuICB9LFxufVxuXG5leHBvcnQgZGVmYXVsdCBzcGVlZHdlbGxDb25maWdcbiJdfQ==