"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/button";
import { FadeIn } from "@/components/animations";

export default function PrivacyPage() {
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
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  গোপনীয়তা নীতি
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  আপনার তথ্য সুরক্ষা এবং গোপনীয়তা সম্পর্কে আমাদের নীতি
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
                রিটার্ন ভ্যাটেড ("আমরা", "আমাদের") আপনার গোপনীয়তা রক্ষা করতে
                প্রতিশ্রুতিবদ্ধ। এই গোপনীয়তা নীতি ব্যাখ্যা করে যে আমরা কীভাবে
                আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার, এবং সুরক্ষিত করি।
              </p>
              <p className="text-gray-700 leading-relaxed">
                এই প্ল্যাটফর্ম ব্যবহার করার মাধ্যমে, আপনি এই গোপনীয়তা নীতির
                সাথে সম্মত হচ্ছেন।
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ২. আমরা যে তথ্য সংগ্রহ করি
              </h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                ২.১ ব্যক্তিগত তথ্য
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>নাম এবং যোগাযোগের তথ্য</li>
                <li>জাতীয় পরিচয়পত্র নম্বর (এনআইডি)</li>
                <li>ফোন নম্বর এবং ইমেইল ঠিকানা</li>
                <li>ছবি এবং পরিচয়পত্রের কপি</li>
                <li>নমিনির তথ্য (নাম, এনআইডি, ছবি)</li>
                <li>রেফারেন্সের তথ্য</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                ২.২ আর্থিক তথ্য
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>জমা এবং উত্তোলনের তথ্য</li>
                <li>সঞ্চয়ের ইতিহাস</li>
                <li>লেনদেনের বিবরণ</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                ২.৩ প্রযুক্তিগত তথ্য
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>আইপি ঠিকানা</li>
                <li>ব্রাউজার টাইপ এবং সংস্করণ</li>
                <li>ডিভাইসের তথ্য</li>
                <li>লগ ফাইল এবং ব্যবহারের প্যাটার্ন</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ৩. আমরা তথ্য কীভাবে ব্যবহার করি
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  প্ল্যাটফর্মের সেবা প্রদান এবং আপনার অ্যাকাউন্ট পরিচালনা করা
                </li>
                <li>
                  সঞ্চয় এবং আর্থিক লেনদেন প্রক্রিয়াকরণ করা
                </li>
                <li>
                  আপনার অনুরোধ এবং প্রশ্নের উত্তর প্রদান করা
                </li>
                <li>
                  গুরুত্বপূর্ণ আপডেট এবং নোটিফিকেশন পাঠানো
                </li>
                <li>
                  প্ল্যাটফর্মের নিরাপত্তা এবং প্রতারণা রোধ করা
                </li>
                <li>
                  আইনগত বাধ্যবাধকতা পূরণ করা
                </li>
                <li>
                  প্ল্যাটফর্ম উন্নতি এবং ব্যবহারকারীর অভিজ্ঞতা উন্নত করা
                </li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ৪. তথ্য শেয়ারিং
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                আমরা আপনার ব্যক্তিগত তথ্য সুরক্ষিত রাখি এবং শুধুমাত্র নিম্নলিখিত
                পরিস্থিতিতে শেয়ার করি:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  <strong>আইনগত বাধ্যবাধকতা:</strong> যদি আইন দ্বারা প্রয়োজন হয়
                  বা আদালতের আদেশে
                </li>
                <li>
                  <strong>সেবা প্রদানকারী:</strong> আমাদের সাথে কাজ করা বিশ্বস্ত
                  তৃতীয় পক্ষের সেবা প্রদানকারী, যারা আমাদের গোপনীয়তা নীতি
                  মেনে চলে
                </li>
                <li>
                  <strong>ব্যবসায়িক স্থানান্তর:</strong> যদি আমাদের ব্যবসা
                  বিক্রি, একত্রীকরণ, বা স্থানান্তরিত হয়
                </li>
                <li>
                  <strong>আপনার সম্মতি:</strong> আপনার স্পষ্ট সম্মতি ছাড়া আমরা
                  আপনার তথ্য শেয়ার করি না
                </li>
              </ul>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ৫. তথ্য সুরক্ষা
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                আমরা আপনার তথ্য সুরক্ষিত রাখার জন্য বিভিন্ন নিরাপত্তা ব্যবস্থা
                গ্রহণ করি:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  <strong>এনক্রিপশন:</strong> সংবেদনশীল তথ্য এনক্রিপ্ট করে সংরক্ষণ
                  করা
                </li>
                <li>
                  <strong>নিরাপদ সার্ভার:</strong> আধুনিক নিরাপত্তা ব্যবস্থা
                  সহ সার্ভার ব্যবহার
                </li>
                <li>
                  <strong>প্রবেশাধিকার নিয়ন্ত্রণ:</strong> শুধুমাত্র অনুমোদিত
                  কর্মীদের তথ্য অ্যাক্সেস করার অনুমতি
                </li>
                <li>
                  <strong>নিয়মিত নিরাপত্তা পরীক্ষা:</strong> আমাদের সিস্টেমের
                  নিরাপত্তা নিয়মিত পরীক্ষা করা
                </li>
                <li>
                  <strong>ব্যাকআপ:</strong> তথ্যের নিয়মিত ব্যাকআপ নেওয়া
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                তবে, কোন ইন্টারনেট-ভিত্তিক সিস্টেম সম্পূর্ণ নিরাপদ নয়। আমরা
                সর্বোচ্চ চেষ্টা করি, কিন্তু আমরা ১০০% নিরাপত্তার গ্যারান্টি দিতে
                পারি না।
              </p>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ৬. আপনার অধিকার
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                আপনার ব্যক্তিগত তথ্য সম্পর্কে আপনার নিম্নলিখিত অধিকার রয়েছে:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  <strong>অ্যাক্সেস:</strong> আপনার সংরক্ষিত তথ্য দেখার অধিকার
                </li>
                <li>
                  <strong>সংশোধন:</strong> ভুল বা পুরানো তথ্য আপডেট করার
                  অধিকার
                </li>
                <li>
                  <strong>মুছে ফেলা:</strong> আপনার তথ্য মুছে ফেলার অনুরোধ করার
                  অধিকার (আইনগত বাধ্যবাধকতা ছাড়া)
                </li>
                <li>
                  <strong>প্রতিবাদ:</strong> আপনার তথ্য ব্যবহারের বিরুদ্ধে
                  প্রতিবাদ করার অধিকার
                </li>
                <li>
                  <strong>ডেটা পোর্টেবিলিটি:</strong> আপনার তথ্য অন্য সেবায়
                  স্থানান্তর করার অধিকার
                </li>
              </ul>
            </section>

            {/* Cookies and Tracking */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ৭. কুকিজ এবং ট্র্যাকিং
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                আমরা প্ল্যাটফর্মের কার্যকারিতা উন্নত করতে এবং ব্যবহারকারীর
                অভিজ্ঞতা বাড়াতে কুকিজ ব্যবহার করতে পারি। আপনি আপনার ব্রাউজার
                সেটিংসে কুকিজ নিয়ন্ত্রণ করতে পারেন।
              </p>
              <p className="text-gray-700 leading-relaxed">
                আমরা বিশ্লেষণ এবং উন্নতির জন্য ব্যবহারের তথ্য সংগ্রহ করতে পারি,
                তবে এটি ব্যক্তিগতভাবে শনাক্তযোগ্য নয়।
              </p>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ৮. তথ্য সংরক্ষণ
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                আমরা আইনগত বাধ্যবাধকতা এবং ব্যবসায়িক প্রয়োজন অনুযায়ী আপনার
                তথ্য সংরক্ষণ করি:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  সক্রিয় অ্যাকাউন্টের তথ্য যতদিন অ্যাকাউন্ট সক্রিয় থাকে
                </li>
                <li>
                  আর্থিক লেনদেনের রেকর্ড আইনগত প্রয়োজন অনুযায়ী
                </li>
                <li>
                  অ্যাকাউন্ট বাতিলের পর, আমরা প্রয়োজনীয় তথ্য আইনগত বাধ্যবাধকতা
                  অনুযায়ী সংরক্ষণ করি
                </li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ৯. শিশুদের গোপনীয়তা
              </h2>
              <p className="text-gray-700 leading-relaxed">
                আমাদের প্ল্যাটফর্ম ১৮ বছরের কম বয়সী ব্যক্তিদের জন্য নয়। আমরা
                জেনে-শুনে ১৮ বছরের কম বয়সী ব্যক্তিদের কাছ থেকে তথ্য সংগ্রহ করি
                না। যদি আমরা জানতে পারি যে আমরা ১৮ বছরের কম বয়সী কারো কাছ থেকে
                তথ্য সংগ্রহ করেছি, আমরা সেই তথ্য অবিলম্বে মুছে ফেলব।
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ১০. গোপনীয়তা নীতির পরিবর্তন
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                আমরা যে কোন সময় এই গোপনীয়তা নীতি পরিবর্তন করার অধিকার
                সংরক্ষণ করি। গুরুত্বপূর্ণ পরিবর্তনের ক্ষেত্রে, আমরা আপনাকে
                ইমেইল বা প্ল্যাটফর্মের মাধ্যমে জানাব।
              </p>
              <p className="text-gray-700 leading-relaxed">
                পরিবর্তিত নীতি প্রকাশের পর প্ল্যাটফর্ম ব্যবহার করা মানে নতুন
                নীতির সাথে সম্মতি প্রদান।
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ১১. যোগাযোগ
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                এই গোপনীয়তা নীতি সম্পর্কে আপনার কোন প্রশ্ন, উদ্বেগ, বা
                অনুরোধ থাকলে, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>ইমেইল:</strong> privacy@returnvetted.com
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>ফোন:</strong> +880-XXX-XXXXXXX
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>ঠিকানা:</strong> [আপনার ঠিকানা]
                </p>
              </div>
            </section>

            {/* Acceptance */}
            <section className="mt-8 pt-8 border-t border-gray-200">
              <div className="bg-primary-50 p-6 rounded-lg">
                <p className="text-gray-800 font-medium text-center">
                  এই গোপনীয়তা নীতি পড়ে বুঝে নিবন্ধন করলে, আপনি এই নীতির সাথে
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
