import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shine } from "@/components/motion";
import Header from "../components/Header";
import { GlowBorder, PageHero } from "@/components/PageFx";
import Footer from "../components/Footer";

const VolunteerPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    availability: "",
    motivation: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert("Thank you for volunteering! We'll contact you soon with more details.");
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-clip">
      <Header />

      <PageHero
        eyebrow="🙌 Lend A Hand"
        title="Volunteer"
        highlight="With Us"
        image="/gallery-new-3.jpg"
        wave="text-gray-100"
        subtitle={<p>Join our mission to create positive change in the community. Fill out the form below to express your interest in volunteering with us.</p>}
      />

      {/* Volunteer Form */}
      <section id="volunteer-form" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <GlowBorder innerClassName="bg-white">
              <Card className="border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="text-2xl text-prachetas-black">Volunteer Registration</CardTitle>
                  <CardDescription>
                    Complete this form to express your interest in volunteering. We'll contact you with upcoming opportunities.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="availability">Availability</Label>
                      <Select onValueChange={(value) => handleInputChange('availability', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-day">Full Day</SelectItem>
                          <SelectItem value="morning">Morning Only</SelectItem>
                          <SelectItem value="afternoon">Afternoon Only</SelectItem>
                          <SelectItem value="evening">Evening Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="experience">Previous Volunteer Experience</Label>
                      <Textarea
                        id="experience"
                        placeholder="Tell us about any previous volunteer experience..."
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="motivation">Why do you want to volunteer with us?</Label>
                      <Textarea
                        id="motivation"
                        placeholder="Share your motivation..."
                        value={formData.motivation}
                        onChange={(e) => handleInputChange('motivation', e.target.value)}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="group relative overflow-hidden w-full bg-prachetas-yellow text-prachetas-black hover:bg-prachetas-bright-yellow text-lg py-6 shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/60 transition-shadow"
                    >
                      <Shine />
                      <span className="relative">Register as Volunteer</span>
                    </Button>
                  </form>
                </CardContent>
              </Card>
              </GlowBorder>
            </div>
          </div>
        </section>

      <Footer />
    </div>
  );
};

export default VolunteerPage;
