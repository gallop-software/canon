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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlZWR3ZWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2VzbGludC9jb25maWdzL3NwZWVkd2VsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFDSCxNQUFNLGVBQWUsR0FBRztJQUN0QixPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7SUFDbkIsS0FBSyxFQUFFO1FBQ0wsMEVBQTBFO1FBQzFFLHlCQUF5QixFQUFFLE1BQU07UUFFakMsdUNBQXVDO1FBQ3ZDLGdDQUFnQyxFQUFFLE1BQU07UUFFeEMsNERBQTREO1FBQzVELCtCQUErQixFQUFFLE1BQU07S0FDeEM7Q0FDRixDQUFBO0FBRUQsZUFBZSxlQUFlLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFNwZWVkd2VsbCB0ZW1wbGF0ZSBjb25maWd1cmF0aW9uXG4gKiBFbmFibGVzIGFsbCBHYWxsb3AgcnVsZXMgcmVsZXZhbnQgdG8gdGhlIFNwZWVkd2VsbCBhcmNoaXRlY3R1cmVcbiAqL1xuY29uc3Qgc3BlZWR3ZWxsQ29uZmlnID0ge1xuICBwbHVnaW5zOiBbJ2dhbGxvcCddLFxuICBydWxlczoge1xuICAgIC8vIEJsb2NrcyBzaG91bGQgYmUgc2VydmVyIGNvbXBvbmVudHMgLSBleHRyYWN0IGNsaWVudCBsb2dpYyB0byBjb21wb25lbnRzXG4gICAgJ2dhbGxvcC9uby1jbGllbnQtYmxvY2tzJzogJ3dhcm4nLFxuXG4gICAgLy8gU2VjdGlvbiBhbHJlYWR5IHByb3ZpZGVzIGNvbnRhaW5tZW50XG4gICAgJ2dhbGxvcC9uby1jb250YWluZXItaW4tc2VjdGlvbic6ICd3YXJuJyxcblxuICAgIC8vIFVzZSBjb21wb25lbnQgcHJvcHMgaW5zdGVhZCBvZiBjbGFzc05hbWUgZm9yIHN0eWxlIHZhbHVlc1xuICAgICdnYWxsb3AvcHJlZmVyLWNvbXBvbmVudC1wcm9wcyc6ICd3YXJuJyxcbiAgfSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgc3BlZWR3ZWxsQ29uZmlnXG4iXX0=