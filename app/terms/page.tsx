"use client";

import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/button";
import { FadeIn } from "@/components/animations";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-8">
      <div className="w-full max-w-4xl mx-auto px-4">
        {/* Header */}
        <FadeIn>
          <div className="mb-8">
            <Link href="/register">
              <Button
                variant="outline"
                size="sm"
                className="mb-4"
                icon={ArrowLeft}
              >
                ফিরে যান
              </Button>
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <FileText className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  শর্তাবলী এবং নীতিমালা
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  রিটার্ন ভ্যাটেড প্ল্যাটফর্ম ব্যবহারের শর্তাবলী
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ১. ভূমিকা
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                রিটার্ন ভ্যাটেড ("আমরা", "আমাদের", "প্ল্যাটফর্ম") একটি সঞ্চয়
                প্ল্যাটফর্ম যা কর্মজীবী মানুষের জন্য ডিজাইন করা হয়েছে। এই
                শর্তাবলী আমাদের প্ল্যাটফর্ম ব্যবহারের নিয়ম এবং শর্তাবলী
                নির্ধারণ করে।
              </p>
              <p className="text-gray-700 leading-relaxed">
                এই প্ল্যাটফর্ম ব্যবহার করার মাধ্যমে, আপনি এই শর্তাবলীর সাথে
                সম্মত হচ্ছেন। যদি আপনি এই শর্তাবলীর সাথে সম্মত না হন, তাহলে
                অনুগ্রহ করে এই প্ল্যাটফর্ম ব্যবহার করবেন না।
              </p>
            </section>

            {/* Account Registration */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ২. অ্যাকাউন্ট নিবন্ধন
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  অ্যাকাউন্ট তৈরি করার জন্য, আপনাকে সঠিক, সম্পূর্ণ এবং
                  আপডেটেড তথ্য প্রদান করতে হবে।
                </li>
                <li>
                  আপনি আপনার অ্যাকাউন্টের নিরাপত্তার জন্য দায়ী। আপনার
                  পাসওয়ার্ড গোপন রাখুন এবং অন্য কারো সাথে শেয়ার করবেন না।
                </li>
                <li>
                  আপনি আপনার অ্যাকাউন্টের মাধ্যমে করা সমস্ত কার্যক্রমের জন্য
                  দায়ী থাকবেন।
                </li>
                <li>
                  যদি আপনার অ্যাকাউন্টে কোন অননুমোদিত প্রবেশাধিকার সন্দেহ করেন,
                  তাহলে অবিলম্বে আমাদের জানান।
                </li>
              </ul>
            </section>

            {/* Savings and Deposits */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ৩. সঞ্চয় এবং জমা
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  সঞ্চয় এবং জমার পরিমাণ আমাদের নির্ধারিত নীতিমালা অনুযায়ী হবে।
                </li>
                <li>
                  জমা করা অর্থের উপর সুদ বা রিটার্ন আমাদের নীতিমালা অনুযায়ী
                  প্রদান করা হবে।
                </li>
                <li>
                  জমা এবং উত্তোলনের জন্য নির্দিষ্ট নিয়ম এবং শর্তাবলী প্রযোজ্য
                  হবে।
                </li>
                <li>
                  আমরা আমাদের বিবেচনায় যে কোন সময় নীতিমালা পরিবর্তন করার
                  অধিকার সংরক্ষণ করি।
                </li>
              </ul>
            </section>

            {/* User Responsibilities */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ৪. ব্যবহারকারীর দায়িত্ব
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  প্ল্যাটফর্মটি শুধুমাত্র বৈধ উদ্দেশ্যে ব্যবহার করবেন।
                </li>
                <li>
                  কোন অবৈধ, ক্ষতিকর, বা আপত্তিকর সামগ্রী পোস্ট বা শেয়ার করবেন
                  না।
                </li>
                <li>
                  প্ল্যাটফর্মের নিরাপত্তা বা কার্যকারিতাকে ক্ষতিগ্রস্ত করার
                  কোন প্রচেষ্টা করবেন না।
                </li>
                <li>
                  অন্যান্য ব্যবহারকারীদের সাথে সম্মানজনক আচরণ করবেন।
                </li>
              </ul>
            </section>

            {/* Privacy and Data */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ৫. গোপনীয়তা এবং তথ্য
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                আমরা আপনার ব্যক্তিগত তথ্য সুরক্ষিত রাখার জন্য প্রতিশ্রুতিবদ্ধ।
                আমাদের গোপনীয়তা নীতি সম্পর্কে বিস্তারিত জানতে অনুগ্রহ করে আমাদের
                গোপনীয়তা নীতি পৃষ্ঠা দেখুন।
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  আমরা আপনার প্রদত্ত তথ্য শুধুমাত্র প্ল্যাটফর্মের কার্যক্রমের
                  জন্য ব্যবহার করি।
                </li>
                <li>
                  আমরা আপনার তথ্য তৃতীয় পক্ষের সাথে শেয়ার করি না, আইনগত
                  বাধ্যবাধকতা ছাড়া।
                </li>
                <li>
                  আপনার তথ্য সুরক্ষিত রাখার জন্য আমরা আধুনিক নিরাপত্তা ব্যবস্থা
                  ব্যবহার করি।
                </li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ৬. দায়িত্বের সীমাবদ্ধতা
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                আমরা আমাদের সর্বোচ্চ চেষ্টা করি প্ল্যাটফর্মটি নিরাপদ এবং নির্ভরযোগ্য
                রাখতে। তবে, আমরা নিম্নলিখিত ক্ষেত্রে দায়ী থাকব না:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  প্রযুক্তিগত সমস্যা, সার্ভার ডাউনটাইম, বা ইন্টারনেট সংযোগ
                  সমস্যার কারণে সৃষ্ট কোন ক্ষতি।
                </li>
                <li>
                  ব্যবহারকারীর ভুল বা অবহেলার কারণে সৃষ্ট কোন ক্ষতি।
                </li>
                <li>
                  তৃতীয় পক্ষের কার্যক্রমের কারণে সৃষ্ট কোন ক্ষতি।
                </li>
                <li>
                  অপ্রত্যাশিত ঘটনা বা প্রাকৃতিক দুর্যোগের কারণে সৃষ্ট কোন ক্ষতি।
                </li>
              </ul>
            </section>

            {/* Termination */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ৭. অ্যাকাউন্ট বাতিলকরণ
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  আপনি যে কোন সময় আপনার অ্যাকাউন্ট বাতিল করতে পারেন।
                </li>
                <li>
                  আমরা এই শর্তাবলী লঙ্ঘন করলে আপনার অ্যাকাউন্ট বাতিল করার
                  অধিকার সংরক্ষণ করি।
                </li>
                <li>
                  অ্যাকাউন্ট বাতিল হলে, আপনার অবশিষ্ট জমা এবং সুদ প্রদান করা
                  হবে।
                </li>
                <li>
                  অ্যাকাউন্ট বাতিলের পর, আপনার তথ্য আমাদের নীতিমালা অনুযায়ী
                  সংরক্ষিত থাকবে।
                </li>
              </ul>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ৮. শর্তাবলীর পরিবর্তন
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                আমরা যে কোন সময় এই শর্তাবলী পরিবর্তন করার অধিকার সংরক্ষণ করি।
                গুরুত্বপূর্ণ পরিবর্তনের ক্ষেত্রে, আমরা আপনাকে ইমেইল বা প্ল্যাটফর্মের
                মাধ্যমে জানাব।
              </p>
              <p className="text-gray-700 leading-relaxed">
                পরিবর্তিত শর্তাবলী প্রকাশের পর প্ল্যাটফর্ম ব্যবহার করা মানে
                নতুন শর্তাবলীর সাথে সম্মতি প্রদান।
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ৯. যোগাযোগ
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                এই শর্তাবলী সম্পর্কে আপনার কোন প্রশ্ন বা উদ্বেগ থাকলে, অনুগ্রহ করে
                আমাদের সাথে যোগাযোগ করুন:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>ইমেইল:</strong> support@returnvetted.com
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>ফোন:</strong> +880-XXX-XXXXXXX
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>ঠিকানা:</strong> [আপনার ঠিকানা]
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ১০. আইনগত বিধান
              </h2>
              <p className="text-gray-700 leading-relaxed">
                এই শর্তাবলী বাংলাদেশের আইন দ্বারা নিয়ন্ত্রিত হবে। এই শর্তাবলী
                সম্পর্কে কোন বিরোধ দেখা দিলে, বাংলাদেশের আদালতের এখতিয়ার থাকবে।
              </p>
            </section>

            {/* Acceptance */}
            <section className="mt-8 pt-8 border-t border-gray-200">
              <div className="bg-primary-50 p-6 rounded-lg">
                <p className="text-gray-800 font-medium text-center">
                  এই শর্তাবলী পড়ে বুঝে নিবন্ধন করলে, আপনি এই সমস্ত শর্তাবলীর সাথে
                  সম্মত হচ্ছেন।
                </p>
                <p className="text-gray-600 text-sm text-center mt-2">
                  সর্বশেষ আপডেট: {new Date().toLocaleDateString("bn-BD")}
                </p>
              </div>
            </section>
          </div>

          {/* Back Button */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link href="/register">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                icon={ArrowLeft}
              >
                নিবন্ধন পৃষ্ঠায় ফিরে যান
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
