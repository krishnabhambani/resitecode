
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Starter',
      monthly: '₹499',
      yearly: '₹5,000',
      description: 'Perfect for individuals and small projects',
      features: [
        '100 AI Credits/month',
        'Basic Tools Access',
        'Email Support',
        '5 Projects',
        'Standard Templates',
      ],
      popular: false,
    },
    {
      name: 'Professional',
      monthly: '₹1,499',
      yearly: '₹15,000',
      description: 'Ideal for growing businesses and teams',
      features: [
        'Unlimited AI Credits',
        'Full Feature Access',
        'Priority Support',
        'Unlimited Projects',
        'Premium Templates',
        'Advanced Analytics',
        'Team Collaboration',
      ],
      popular: true,
    },
    {
      name: 'Enterprise',
      monthly: 'Custom Quote',
      yearly: 'Custom Quote',
      description: 'For large organizations with specific needs',
      features: [
        'Custom AI Models',
        'Dedicated Support',
        'On-premise Deployment',
        'Custom Integrations',
        'Advanced Security',
        'SLA Guarantee',
        'Training & Onboarding',
      ],
      popular: false,
    },
  ];

  const handleGetStarted = () => {
    window.open('https://forms.gle/D4yHohi9b6DCGHPf9', '_blank');
  };

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Select the perfect plan for your needs and start building amazing projects
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-lg ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
              Monthly
            </span>
            <motion.button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-16 h-8 bg-gray-600 rounded-full p-1 transition-colors duration-300"
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-6 h-6 bg-green-500 rounded-full shadow-md"
                animate={{ x: billingCycle === 'yearly' ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
            <span className={`text-lg ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="text-green-400 text-sm font-medium">Save 17%</span>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <span className="bg-green-500 text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              <Card className={`bg-black/40 backdrop-blur-sm border-2 transition-all duration-300 h-full ${
                plan.popular 
                  ? 'border-green-400/70 shadow-lg shadow-green-400/20 relative pt-8' 
                  : 'border-white/20 hover:border-green-400/50'
              }`}>
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-green-400 mb-2">
                      {billingCycle === 'monthly' ? plan.monthly : plan.yearly}
                      {plan.name !== 'Enterprise' && (
                        <span className="text-lg text-gray-400">
                          /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm">{plan.description}</p>
                  </div>

                  <div className="flex-grow mb-8">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-gray-300 flex items-center">
                          <span className="text-green-400 mr-3">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button 
                    onClick={handleGetStarted}
                    className={`w-full rounded-full font-medium hover:scale-105 transition-all duration-200 ${
                      plan.popular
                        ? 'bg-green-500 hover:bg-green-600 text-black'
                        : 'bg-transparent border border-green-400 text-green-400 hover:bg-green-400 hover:text-black'
                    }`}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
